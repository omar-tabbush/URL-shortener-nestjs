import { Controller, Get, Post, Body, Param, UseGuards, UseInterceptors } from '@nestjs/common';
import { UrlService } from './url.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { JwtGuard } from '../auth/guards/Jwt.guard';
import { User } from 'src/decorators/user/user.decorator';
import { Public } from 'src/decorators/public/public.decorator';
import { CacheInterceptor, CacheKey } from '@nestjs/cache-manager';

@Controller('url')
@UseGuards(JwtGuard)
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Post()
  create(
    @Body() createUrlDto: CreateUrlDto,
    @User({ prop: 'id', throwIfNotExist: true }) userId: string,
  ) {
    return this.urlService.create(createUrlDto, userId);
  }

  @Public()
  @Get('short/:shortUrl')
  async getUrl(@Param('shortUrl') shortUrl: string) {
    return await this.urlService.findByShortUrl(shortUrl);
  }

  @Public()
  @Get('all')
  async getAll() {
    return await this.urlService.findAll();
  }

}
