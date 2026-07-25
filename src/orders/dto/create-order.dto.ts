import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  MaxLength,
  MinLength,
  Min,
} from 'class-validator';
import { DeliveryType, ParcelType } from '../enums/order.enum';

export class CreateOrderDto {
  //Pickup
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  pickupZone: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(300)
  pickupArea: string;

  //Drop
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  dropZone: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(300)
  dropArea: string;

  //Parcel Info
  @IsEnum(ParcelType, {
    message: 'parcelType must be: document, parcel, or fragile',
  })
  @IsNotEmpty()
  parcelType: ParcelType;

  @IsNumber()
  @IsPositive()
  @Min(0.1, { message: 'weight must be at least 0.1 kg' })
  @Type(() => Number)
  weight: number;

  @IsEnum(DeliveryType, {
    message: 'deliveryType must be: regular or express',
  })
  @IsNotEmpty()
  deliveryType: DeliveryType;
}
