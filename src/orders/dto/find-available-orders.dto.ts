import { IsOptional, IsEnum, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatus } from '../enums/order.enum';

export class FindAvailableOrdersDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pickupZoneId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  dropZoneId?: number;

  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;
}
