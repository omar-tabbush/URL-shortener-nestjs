import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {

  constructor(private prisma: PrismaService) { }

  async create(createUserDto: CreateUserDto) {
    //using bcrypt to hash the password
    const saltOrRounds = 8;
    const hash = await bcrypt.hash(createUserDto.password, saltOrRounds);
    createUserDto.password = hash;

    const user = await this.prisma.user.create({
      data: createUserDto
    });
    delete user.password;
    return user;
  }

  findAll() {
    return `This action returns all user`;
  }

  private readonly users = [
    {
      userId: 1,
      email: 'john',
      password: 'changeme',
    },
    {
      userId: 2,
      email: 'maria',
      password: 'guess',
    },
  ];

  async findOne(id: string): Promise<User> {
    return await this.prisma.user.findUnique({
      where: {
        id
      }
    });
  }

  async findByEmail(email: string): Promise<User> {
    return await this.prisma.user.findUnique({
      where: {
        email
      }
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }


}
