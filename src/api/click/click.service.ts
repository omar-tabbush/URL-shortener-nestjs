import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
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

}
