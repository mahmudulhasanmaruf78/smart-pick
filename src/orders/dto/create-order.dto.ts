import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';
import { DeliveryType, ParcelType } from '../entities/order.entity';

export class CreateOrderDto {
  @IsString()
  @Length(1, 100)
  pickupZone: string;

  @IsString()
  @Length(1, 300)
  pickupArea: string;

  @IsString()
  @Length(1, 100)
  dropZone: string;

  @IsString()
  @Length(1, 300)
  dropArea: string;

  @IsEnum(ParcelType)
  parcelType: ParcelType;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  weight: number;

  @IsEnum(DeliveryType)
  deliveryType: DeliveryType;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  fare?: number;
}
