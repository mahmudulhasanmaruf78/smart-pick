import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class DeliveryZone {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 60 })
  baseRegularFare: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 120 })
  baseExpressFare: number;

  @Column({ type: 'float', default: 2 })
  weightLimitKg: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 20 })
  extraWeightRate: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
