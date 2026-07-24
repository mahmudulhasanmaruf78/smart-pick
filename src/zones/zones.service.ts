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
  async onModuleInit() {
    const exist = await this.zoneRepo.findOne({
      where: { name: 'Inside Dhaka' },
    });
    if (!exist) {
      const zone = this.zoneRepo.create({
        name: 'Inside Dhaka',
        baseRegularFare: 60,
        baseExpressFare: 100,
        weightLimitKg: 2,
        extraWeightRate: 20,
      });
      await this.zoneRepo.save(zone);
      console.log('Zone: Inside Dhaka');
    }
  }
}
