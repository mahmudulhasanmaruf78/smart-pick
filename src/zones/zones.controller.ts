import { Body, Controller, Get, Post } from '@nestjs/common';
import { ZonesService } from './zones.service';
import { CreateZoneDto } from './dto/create-zone.dto';

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
}
