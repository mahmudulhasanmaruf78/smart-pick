import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeliveryZone } from './entities/delivery-zone.entity';

@Injectable()
export class ZonesService implements OnModuleInit {
  constructor(
    @InjectRepository(DeliveryZone)
    private readonly zoneRepo: Repository<DeliveryZone>,
  ) {}
  onModuleInit() {
    console.log('ZonesService initialized, repo:', !!this.zoneRepo);
  }
}
