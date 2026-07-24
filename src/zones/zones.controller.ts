import { Body, Controller, Get, Patch, Post, Param } from '@nestjs/common';
import { ZonesService } from './zones.service';
import { CreateZoneDto } from './dto/create-zone.dto';
import { UpdateZoneDto } from './dto/update-zone.dto';

@Controller('zones')
export class ZonesController {
  constructor(private readonly zoneService: ZonesService) {}

  @Get()
  findAll() {
    return this.zoneService.findAll();
  }

  @Post()
  create(@Body() dto: CreateZoneDto) {
    return this.zoneService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateZoneDto) {
    return this.zoneService.update(parseInt(id), dto);
  }
}
