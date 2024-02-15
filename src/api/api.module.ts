import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { UserService } from './user/user.service';
import { UrlModule } from './url/url.module';
import { ClickModule } from './click/click.module';

@Module({
  imports: [AuthModule, UserModule, UrlModule, ClickModule],
  controllers: [],
  providers: [],
  
})
export class ApiModule {}
