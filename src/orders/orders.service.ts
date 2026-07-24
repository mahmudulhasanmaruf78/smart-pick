import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { DeliveryZone } from '../zones/entities/delivery-zone.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,

    @InjectRepository(DeliveryZone)
    private readonly zoneRepo: Repository<DeliveryZone>,
  ) {}

  private async calculateFare(
    dropZone: string,
    weight: number,
    deliveryType: string,
  ): Promise<number> {
    //Find Original Zone in DeliveryZone table
    const zone = await this.zoneRepo.findOne({
      where: { zoneName: dropZone },
    });

    if (zone == null) {
      throw new BadRequestException(
        `Zone '${dropZone}' not found. Please use a valid zone name.`,
      );
    }
    // Calculate base fare based on delivery type
    let fare: number =
      deliveryType === 'express'
        ? Number(zone.baseExpressFare)
        : Number(zone.baseRegularFare);

    // Weight limit check and extra charge calculation
    if (weight > Number(zone.weightLimit)) {
      const extraWeight = weight - Number(zone.weightLimit);
      const extraCharge = extraWeight * Number(zone.extraWeightRate);
      fare = fare + extraCharge;
    }

    // Round fare to 2 decimal places
    return Math.round(fare * 100) / 100;
  }
