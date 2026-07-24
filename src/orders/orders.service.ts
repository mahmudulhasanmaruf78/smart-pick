import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderStatus } from './enums/order.enum';
import { RiderVerification } from '../users/entities/rider-verification.entity';
import { VerificationStatus } from '../common/enums/verification-status.enum';
import { FindAvailableOrdersDto } from './dto/find-available-orders.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

const RIDER_ALLOWED_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  [OrderStatus.Pending]: [],
  [OrderStatus.Accepted]: [OrderStatus.PickedUp],
  [OrderStatus.PickedUp]: [OrderStatus.InTransit],
  [OrderStatus.InTransit]: [OrderStatus.Delivered],
  [OrderStatus.Delivered]: [],
  [OrderStatus.Cancelled]: [],
};

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(RiderVerification)
    private readonly riderVerificationRepository: Repository<RiderVerification>,
  ) {}

  // ---- RIDER LOGIC ----

  async findAvailable(query: FindAvailableOrdersDto): Promise<Order[]> {
    const where: Partial<Order> = { status: OrderStatus.Pending };
    if (query.pickupZoneId) where.pickupZoneId = query.pickupZoneId;
    if (query.dropZoneId) where.dropZoneId = query.dropZoneId;
    return this.orderRepository.find({
      where,
      relations: { customer: true },
      order: { createdAt: 'ASC' },
    });
  }

  async acceptOrder(orderId: number, rider: { id: number }): Promise<Order> {
    await this.assertRiderVerified(rider.id);

    const order = await this.findOneOrFail(orderId);
    if (order.status !== OrderStatus.Pending) {
      throw new BadRequestException(
        'Order is no longer available for acceptance',
      );
    }
    if (order.riderId) {
      throw new BadRequestException('Order already has a rider assigned');
    }

    order.riderId = rider.id;
    order.status = OrderStatus.Accepted;
    order.acceptedAt = new Date();
    return this.orderRepository.save(order);
  }

  async updateStatus(
    orderId: number,
    dto: UpdateOrderStatusDto,
    rider: { id: number },
  ): Promise<Order> {
    await this.assertRiderVerified(rider.id);

    const order = await this.findOneOrFail(orderId);
    if (order.riderId !== rider.id) {
      throw new ForbiddenException('You are not assigned to this order');
    }

    const allowed = RIDER_ALLOWED_TRANSITIONS[order.status];
    if (!allowed.includes(dto.status)) {
      throw new BadRequestException(
        `Cannot transition from ${order.status} to ${dto.status}`,
      );
    }

    order.status = dto.status;
    return this.orderRepository.save(order);
  }

  private async assertRiderVerified(userId: number): Promise<void> {
    const verification = await this.riderVerificationRepository.findOne({
      where: { userId },
    });
    if (!verification || verification.status !== VerificationStatus.Approved) {
      throw new ForbiddenException('Rider account is not verified');
    }
  }

  private async findOneOrFail(orderId: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: { customer: true, rider: true },
    });
    if (!order) {
      throw new NotFoundException(`Order #${orderId} not found`);
    }
    return order;
  }
}
