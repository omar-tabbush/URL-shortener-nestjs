import { Controller, Post, Query } from '@nestjs/common';
import { ClickService } from './click.service';
import { CreateClickDto } from './dto/create-click.dto';
import { UpdateClickDto } from './dto/update-click.dto';

@Controller('click')
export class ClickController {
  constructor(private readonly clickService: ClickService) {}

  @Post()
  async handleClick(@Query('shortUrl') shortUrl: string){
    return this.clickService.handleClick(shortUrl);
  }

}
