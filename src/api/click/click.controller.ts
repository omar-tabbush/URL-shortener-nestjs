import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ClickService } from './click.service';
import { CreateClickDto } from './dto/create-click.dto';
import { UpdateClickDto } from './dto/update-click.dto';

@Controller('click')
export class ClickController {
  constructor(private readonly clickService: ClickService) {}

  @Post()
  create(@Body() createClickDto: CreateClickDto) {
    return this.clickService.create(createClickDto);
  }

  @Get()
  findAll() {
    return this.clickService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clickService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClickDto: UpdateClickDto) {
    return this.clickService.update(+id, updateClickDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clickService.remove(+id);
  }
}
