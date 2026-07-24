import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum OrderStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  PICKED_UP = 'picked_up',
  IN_TRANSIT = 'in_transit',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

export enum ParcelType {
  DOCUMENT = 'document',
  PARCEL = 'parcel',
  FRAGILE = 'fragile',
}

export enum DeliveryType {
  REGULAR = 'regular',
  EXPRESS = 'express',
}

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  pickupZone: string;

  @Column({ type: 'varchar', length: 300 })
  pickupArea: string;

  @Column({ type: 'varchar', length: 100 })
  dropZone: string;

  @Column({ type: 'varchar', length: 300 })
  dropArea: string;

  @Column({ type: 'enum', enum: ParcelType, default: ParcelType.PARCEL })
  parcelType: ParcelType;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  weight: number;

  @Column({ type: 'enum', enum: DeliveryType, default: DeliveryType.REGULAR })
  deliveryType: DeliveryType;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  fare: number;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @Column({ type: 'timestamp', nullable: true })
  acceptedAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

