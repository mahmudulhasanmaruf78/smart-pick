import { IsEnum } from 'class-validator';
import { OrderStatus } from '../enums/order.enum';

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus, {
    message: 'status must be one of picked_up, in_transit, delivered',
  })
  status: OrderStatus;
}
