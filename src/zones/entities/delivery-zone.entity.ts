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

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  baseRegularFare: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  baseExpressFare: number;

  @Column({ type: 'float' })
  weightLimitKg: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  extraWeightRate: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
