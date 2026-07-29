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
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class ZonesService implements OnModuleInit {
  constructor(
    @InjectRepository(DeliveryZone)
    private readonly zoneRepo: Repository<DeliveryZone>,
    private readonly mailerService: MailerService,
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

      try{
        await this.mailerService.sendMail({
          to: 'mahmudulhasanmaruf78@gmail.com',
          subject: `Zone ${zone.name} has been created.`,
          html:`<h3>New Delivery Zone Added</h3>
            <p><b>Zone Name:</b> ${zone.name}</p>
            <p><b>Base Regular Fare:</b> ৳${zone.baseRegularFare}</p>
            <p><b>Base Express Fare:</b> ৳${zone.baseExpressFare}</p>
            <p><b>Weight Limit:</b> ${zone.weightLimitKg} kg</p>
            <p><b>Extra Weight Rate:</b> ৳${zone.extraWeightRate}/kg</p>
          `,});
        }
        catch (emailError){
          console.log(emailError);
        }
      }
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
