import { Module } from '@nestjs/common';
import { UrlService } from './url.service';
import { UrlController } from './url.controller';
import { ClickService } from '../click/click.service';
import { APP_GUARD } from '@nestjs/core';
import { JwtGuard } from '../auth/guards/Jwt.guard';

@Module({
  controllers: [UrlController],
  providers: [
    ClickService,
    UrlService,
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    }
  ],
  exports: [UrlService],
})
export class UrlModule {}
