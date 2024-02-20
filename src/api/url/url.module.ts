import { Module } from '@nestjs/common';
import { UrlService } from './url.service';
import { UrlController } from './url.controller';
import { ClickService } from '../click/click.service';

@Module({
  controllers: [UrlController],
  providers: [ClickService, UrlService],
  exports: [UrlService],
})
export class UrlModule {}
