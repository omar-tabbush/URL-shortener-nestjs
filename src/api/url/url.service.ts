import { Inject, Injectable } from '@nestjs/common';
import { CreateUrlDto } from './dto/create-url.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { nanoid } from 'nanoid';
import { ClickService } from '../click/click.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Url } from '@prisma/client';

@Injectable()
export class UrlService {
  constructor(
    private prisma: PrismaService,
    private click: ClickService,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
  ) {}

  async create(createClickDto: CreateUrlDto, userId: string) {
    if (!createClickDto.shortUrl) {
      // create an unique id
      // it will store only the unique id without the domain of the url shortener web app
      createClickDto.shortUrl = nanoid(6);
    }

    const url = await this.prisma.url.create({
      data: { ...createClickDto, shortUrl: createClickDto.shortUrl, userId },
    });

    await this.cacheService.set(url.shortUrl, url);
    console.log(`Setting ${url.shortUrl} data to cache!`);

    return url;
  }

  async findByShortUrl(shortUrl: string) {
    const cachedUrl = await this.cacheService.get<Url>(shortUrl);

    if (cachedUrl) {
      await this.addOneClick(cachedUrl.id);
      console.log(`Getting ${cachedUrl?.shortUrl} data from cache!`);
      return cachedUrl;
    }
    const url = await this.prisma.url.findUniqueOrThrow({
      where: { shortUrl },
    });

    await this.cacheService.set(url.shortUrl, url);

    await this.addOneClick(url.id);
    return url;
  }

  async findAll(userId: string, page: number) {
    const pageSize = 20;
    const cachedUrls = await this.cacheService.get<Url[]>(
      `${userId}-urls-${page}`,
    );

    let urls: Url[];

    if (cachedUrls) {
      console.log(`Getting ${userId} data from cache!`);
      urls = cachedUrls;
    } else {
      urls = await this.prisma.url.findMany({
        where: { userId },
        take: pageSize,
        skip: (page - 1 >= 0 ? page : 0) * pageSize,
        orderBy: {
          createdAt: 'desc',
        },
      });
    }

    const cachedCount = await this.cacheService.get<number>(
      `${userId}-urls-count`,
    );

    let count: number;
    if (cachedCount) {
      count = cachedCount;
    } else {
      count = await this.prisma.url.count({
        where: { userId },
      });
    }

    await this.cacheService.set(`${userId}-urls-count`, count);
    console.log(`Setting ${userId} totalUrls to cache!`);

    console.log(`Setting ${userId} data to cache!`);
    await this.cacheService.set(`${userId}-urls-${page}`, urls);

    return { urls, count, pageSize };
  }

  async addOneClick(id: string) {
    await this.click.create(id);
    return await this.prisma.url.update({
      where: { id },
      data: {
        clicksCount: {
          increment: 1,
        },
      },
    });
  }
  async delete(id: string, userId: string, page?: number) {
    const deleted = await this.prisma.url.delete({
      where: { id, userId },
      select: {
        shortUrl: true,
      },
    });
    if (deleted) {
      await this.cacheService.del(`${userId}-urls-count`);
      await this.cacheService.del(`${userId}-urls-${page ?? 0}`);
      await this.cacheService.del(`${deleted.shortUrl}`);
    }
    return deleted;
  }
}
