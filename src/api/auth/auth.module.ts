import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { LocalStrategy } from './strategies/local.strategy';
import { UserService } from '../user/user.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, UserService],
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || '',
      signOptions: { expiresIn: '24h' },
    }),

  ]
})
export class AuthModule {}
