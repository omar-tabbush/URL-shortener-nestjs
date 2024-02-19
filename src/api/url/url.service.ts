import { Injectable } from '@nestjs/common';
import { CreateUrlDto } from './dto/create-url.dto';
import { UpdateUrlDto } from './dto/update-url.dto';
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

    // await this.click.create(url.id);

    return url;
  }

  async findByShortUrl(shortUrl: string) {
    return await this.prisma.url.findUniqueOrThrow({
      where: { shortUrl },
    });
  }

  async findAll() {
    return await this.prisma.url.findMany({
      select: {
        shortUrl: true,
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} url`;
  }

  update(id: number, updateUrlDto: UpdateUrlDto) {
    return `This action updates a #${id} url`;
  }

  async addOneClick(id: string) {
    return await this.prisma.url.update({
      where: { id },
      data: {
        clicksCount: {
          increment: 1,
        },
      },
    });
  }

  remove(id: number) {
    return `This action removes a #${id} url`;
  }
}
