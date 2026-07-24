import {
  Injectable,
  OnModuleInit,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeliveryZone } from './entities/delivery-zone.entity';
import { CreateZoneDto } from './dto/create-zone.dto';
import { UpdateZoneDto } from './dto/update-zone.dto';

@Injectable()
export class ZonesService implements OnModuleInit {
  constructor(
    @InjectRepository(DeliveryZone)
    private readonly zoneRepo: Repository<DeliveryZone>,
  ) {}
  async onModuleInit() {
    const InsideDhakaExist = await this.zoneRepo.findOne({
      where: { name: 'Inside Dhaka' },
    });
    if (!InsideDhakaExist) {
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

    const OutsideDhakaExist = await this.zoneRepo.findOne({
      where: { name: 'Outside Dhaka' },
    });
    if (!OutsideDhakaExist) {
      const zone = this.zoneRepo.create({
        name: 'Outside Dhaka',
        baseRegularFare: 120,
        baseExpressFare: 180,
        weightLimitKg: 2,
        extraWeightRate: 30,
      });

      await this.zoneRepo.save(zone);
      console.log('Zone: Outside Dhaka');
    }
  }

  async findAll() {
    return this.zoneRepo.find();
  }

  async create(dto: CreateZoneDto) {
    try {
      const zone = this.zoneRepo.create(dto);
      return await this.zoneRepo.save(zone);
    } catch (error) {
      if (error instanceof Error && 'code' in error && error.code === '23505') {
        throw new ConflictException(
          `A zone named "${dto.name}" already exists.`,
        );
      }
      throw error;
    }
  }

  async update(id: number, dto: UpdateZoneDto) {
    const zone = await this.zoneRepo.findOne({ where: { id } });
    if (!zone) {
      throw new NotFoundException(`Zone with ${id} not found.`);
    }
    Object.assign(zone, dto);
    return this.zoneRepo.save(zone);
  }
}
