import { IsString, IsNumber, IsPositive } from 'class-validator';

export class CreateZoneDto {
  @IsString()
  name: string;

  @IsNumber()
  @IsPositive()
  baseRegularFare: number;

  @IsNumber()
  @IsPositive()
  baseExpressFare: number;

  @IsNumber()
  @IsPositive()
  weightLimitKg: number;

  @IsNumber()
  @IsPositive()
  extraWeightRate: number;
}
