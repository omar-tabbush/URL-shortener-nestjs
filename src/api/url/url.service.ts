import { Injectable } from '@nestjs/common';
import { CreateUrlDto } from './dto/create-url.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { nanoid } from 'nanoid';
import { ClickService } from '../click/click.service';

@Injectable()
export class UrlService {
  constructor(
    private prisma: PrismaService,
    private click: ClickService,
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

    return url;
  }

  async findByShortUrl(shortUrl: string) {
    const url = await this.prisma.url.findUniqueOrThrow({
      where: { shortUrl },
    });
    await this.addOneClick(url.id);
    return url;
  }

  async findAll() {
    return await this.prisma.url.findMany({
      select: {
        shortUrl: true,
      },
    });
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
}
