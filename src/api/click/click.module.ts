import { Module } from '@nestjs/common';
import { ClickService } from './click.service';
import { UrlService } from '../url/url.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [],
  providers: [ClickService, UrlService],
  exports: [ClickService],
})
export class ClickModule {}
