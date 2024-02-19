import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { UrlModule } from './url/url.module';
import { ClickModule } from './click/click.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtStrategy } from './auth/strategies/jwt.strategy';

@Module({
  imports: [
    AuthModule,
    UserModule,
    UrlModule,
    ClickModule,
    ConfigModule.forRoot({
      load: [
        () => ({
          secret: process.env.JWT_SECRET ?? '',
        }),
      ],
    }),
  ],
  controllers: [],
  providers: [ConfigService, PrismaService, JwtStrategy],
})
export class ApiModule {}
