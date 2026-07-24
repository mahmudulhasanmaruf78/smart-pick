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

  //CREATE ORDER
  async createOrder(
    createOrderDto: CreateOrderDto,
    customer: User,
  ): Promise<Order> {
    // Fare auto-calculate 
    const fare = await this.calculateFare(
      createOrderDto.dropZone,
      createOrderDto.weight,
      createOrderDto.deliveryType,
    );

    // New order create
    const order = this.orderRepo.create({
      ...createOrderDto,
      fare: fare,
      status: OrderStatus.PENDING,
      customer: customer,
      rider: null,
      acceptedAt: null,
    });

    return await this.orderRepo.save(order);
  }

  //Edit Order 
  async editOrder(
    id: number,
    updateOrderDto: UpdateOrderDto,
    customer: User,
  ): Promise<Order> {
    //Find Order 
    const order = await this.orderRepo.findOne({
      where: { id: id },
      relations: { customer: true },
    });

    if (order == null) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }

    // Only the customer who created the order can edit it
    if (order.customer.id !== customer.id) {
      throw new ForbiddenException(
        'You are not allowed to edit this order',
      );
    }

    // Only pending orders can be edited
    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException(
        `Cannot edit order. Order status is '${order.status}'. Only 'pending' orders can be edited.`,
      );
    }

    // Calculate new fare based on updated details
    const newDropZone = updateOrderDto.dropZone ?? order.dropZone;
    const newWeight = updateOrderDto.weight ?? order.weight;
    const newDeliveryType = updateOrderDto.deliveryType ?? order.deliveryType;

    const newFare = await this.calculateFare(
      newDropZone,
      newWeight,
      newDeliveryType,
    );

    // Order update
    Object.assign(order, updateOrderDto, { fare: newFare });

    return await this.orderRepo.save(order);
  }

  // Cancel Order
  async cancelOrder(id: number, customer: User): Promise<string> {
    const order = await this.orderRepo.findOne({
      where: { id: id },
      relations: { customer: true },
    });

    if (order == null) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }

    // Only the customer who created the order can cancel it
    if (order.customer.id !== customer.id) {
      throw new ForbiddenException(
        'You are not allowed to cancel this order',
      );
    }

    // Pending order 
    if (order.status === OrderStatus.PENDING) {
      order.status = OrderStatus.CANCELLED;
      await this.orderRepo.save(order);
      return `Order id ${id} has been cancelled successfully`;
    }

    // Accepted order 
    if (order.status === OrderStatus.ACCEPTED) {
      if (order.acceptedAt == null) {
        throw new BadRequestException('Invalid order state: acceptedAt is missing.');
      }
      const now = new Date();
      const acceptedAt = new Date(order.acceptedAt);
      const diffInMilliseconds = now.getTime() - acceptedAt.getTime();
      const diffInHours = diffInMilliseconds / (1000 * 60 * 60);

      if (diffInHours <= 1) {
        order.status = OrderStatus.CANCELLED;
        await this.orderRepo.save(order);
        return `Order id ${id} has been cancelled successfully`;
      } else {
        throw new BadRequestException(
          'Cannot cancel order. More than 1 hour has passed since the rider accepted.',
        );
      }
    }

    // Other statuses (DELIVERED, CANCELLED) cannot be cancelled
    throw new BadRequestException(
      `Cannot cancel order with status '${order.status}'.`,
    );
  }

  //Get Order History for a specific customer
  async getCustomerHistory(customer: User): Promise<Order[]> {
    return await this.orderRepo.find({
      where: {
        customer: { id: customer.id },
      },
      relations: {
        rider: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }
}