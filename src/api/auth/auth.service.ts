import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {

  constructor(
    private jwtService: JwtService,
    private usersService: UserService,
  ) {}

  async register(createAuthDto: any) {
    const user = await this.usersService.create(createAuthDto);
    
    return {
      access_token: this.jwtService.sign(user),
      ...user
    };
  }

  findAll() {
    return `This action returns all auth`;
  }

  async me(id: string) {
    return await this.usersService.findOne(id);
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }

  async validateUser(email: string, pass: string): Promise<User> | null {
    const user = await this.usersService.findByEmail(email);
    
    //bcrypt compare password with pass
    if(user && await bcrypt.compare(pass, user.password)){
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async login(user: any) {
    
    const validate = await this.validateUser(user.email, user.password);

    if (!validate) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      access_token: this.jwtService.sign(validate),
      ...validate
    };
  }
}
