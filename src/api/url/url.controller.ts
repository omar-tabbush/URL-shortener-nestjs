import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  Delete,
} from '@nestjs/common';
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

  @Get('all/:page')
  async getAll(
    @User({ prop: 'id', throwIfNotExist: true }) userId: string,
    @Param('page') page: number,
  ) {
    return await this.urlService.findAll(userId, page);
  }

  @Delete(':id')
  async delete(
    @Param('id') id: string,
    @User({ prop: 'id', throwIfNotExist: true }) userId: string,
    @Body() body: {page?: number}, // to remove the cached url page
  ) {
    return await this.urlService.delete(id, userId, body?.page);
  }
}
