import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { OrderStatus, DeliveryType, ParcelType } from '../enums/order.enum';
import { User } from '../../users/entities/user.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  customerId?: number;

  @ManyToOne(() => User, (user) => user.customerOrders, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'customerId' })
  customer?: User;

  @Column({ nullable: true })
  riderId?: number;

  @ManyToOne(() => User, (user) => user.riderOrders, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'riderId' })
  rider?: User | null;

  @Column({ nullable: true })
  pickupZoneId?: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  pickupZone?: string;

  @Column({ type: 'varchar', length: 300 })
  pickupArea: string;

  @Column({ nullable: true })
  dropZoneId?: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  dropZone?: string;

  @Column({ type: 'varchar', length: 300 })
  dropArea: string;

  @Column({ type: 'enum', enum: ParcelType, default: ParcelType.Parcel })
  parcelType: ParcelType | string;

  @Column({ type: 'float' })
  weight: number;

  @Column({ type: 'enum', enum: DeliveryType, default: DeliveryType.Regular })
  deliveryType: DeliveryType;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  fare: number;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.Pending })
  status: OrderStatus;

  @Column({ type: 'timestamp', nullable: true })
  acceptedAt?: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
