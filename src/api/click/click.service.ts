import { Injectable } from '@nestjs/common';
import { CreateClickDto } from './dto/create-click.dto';
import { UpdateClickDto } from './dto/update-click.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UrlService } from '../url/url.service';

@Injectable()
export class ClickService {
  constructor(
    private prisma: PrismaService,
  ) {}
  async create(urlId: string) {
    return await this.prisma.click.create({
      data: {
        urlId,
      },
    });
  }

  async handleClick(shortUrl: string) {
    const clicked = await this.prisma.click.create({
      data: {
        url: {
          connect: {
            shortUrl,
          },
        },
      },
    });
    // await this.urlService.addOneClick(clicked.urlId);

    return clicked;
  }

  findAll() {
    return `This action returns all click`;
  }

  findOne(id: number) {
    return `This action returns a #${id} click`;
  }

  update(id: number, updateClickDto: UpdateClickDto) {
    return `This action updates a #${id} click`;
  }

  remove(id: number) {
    return `This action removes a #${id} click`;
  }
}
