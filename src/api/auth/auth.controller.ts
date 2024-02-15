import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { AuthGuard } from '@nestjs/passport';
import { JwtGuard } from './guards/Jwt.guard';
import { User } from 'src/decorators/user/user.decorator';

@Controller('auth')
export class AuthController {

  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Body() loginBody: { email: string, password: string }) {
    return await this.authService.login(loginBody);
  }

  @Post('register')
  async register(@Body() createAuthDto: CreateAuthDto) {
    return await this.authService.register(createAuthDto);
  }

  @Get('me')
  @UseGuards(JwtGuard)
  async me(@User('id') userId : string) {
    return  await this.authService.me(userId);
  }

}
