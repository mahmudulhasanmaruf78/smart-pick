import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum OrderStatus {
  PENDING = 'pending',       // Customer create order
  ACCEPTED = 'accepted',     // Rider accept order
  PICKED_UP = 'picked_up',   // Rider pick up parcel
  IN_TRANSIT = 'in_transit', // Rider is delivering parcel
  DELIVERED = 'delivered',   
  CANCELLED = 'cancelled',  
}

//Parcel type
export enum ParcelType {
  DOCUMENT = 'document',
  PARCEL = 'parcel',
  FRAGILE = 'fragile',
}

// Delivery type
export enum DeliveryType {
  REGULAR = 'regular',
  EXPRESS = 'express',
}

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  //Pickup Information
  @Column({ type: 'varchar', length: 100 })
  pickupZone: string;

  @Column({ type: 'varchar', length: 300 })
  pickupArea: string;

  //Drop Information
  @Column({ type: 'varchar', length: 100 })
  dropZone: string;

  @Column({ type: 'varchar', length: 300 })
  dropArea: string;

  @Column({ type: 'varchar', length: 100 })
  customerName: string;

  @Column({ type: 'varchar', length: 20 })
  customerPhone: string;

  @Column({ type: 'varchar', length: 300, nullable: true })
  customerAddress: string | null;

  //Parcel Details
  @Column({ type: 'enum', enum: ParcelType, default: ParcelType.PARCEL })
  parcelType: ParcelType;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  weight: number; // KG

  @Column({ type: 'enum', enum: DeliveryType, default: DeliveryType.REGULAR })
  deliveryType: DeliveryType;

  // Fare (auto-calculated)
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  fare: number;

  //Order Status
  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @Column({ type: 'timestamp', nullable: true })
  acceptedAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
