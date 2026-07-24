import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { OrderStatus, DeliveryType } from '../enums/order.enum';
import { User } from '../../users/entities/user.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  customerId: number;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'customerId' })
  customer?: User;

  @Column({ nullable: true })
  riderId?: number;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'riderId' })
  rider?: User;

  @Column()
  pickupZoneId: number;

  @Column()
  pickupArea: string;

  @Column()
  dropZoneId: number;

  @Column()
  dropArea: string;

  @Column()
  parcelType: string;

  @Column({ type: 'float' })
  weight: number;

  @Column({ type: 'enum', enum: DeliveryType })
  deliveryType: DeliveryType;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  fare: number;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.Pending })
  status: OrderStatus;

  @Column({ type: 'timestamp', nullable: true })
  acceptedAt?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
