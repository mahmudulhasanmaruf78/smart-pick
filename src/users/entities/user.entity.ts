import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { RiderVerification } from './rider-verification.entity';
import { Role } from '../../common/enums/role.enum';
import { Order } from '../../orders/entities/order.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  phone: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: Role, default: Role.Customer })
  role: Role;

  @Column({ default: true })
  isActive: boolean;

  @OneToOne(() => RiderVerification, (rv) => rv.user, {
    cascade: true,
    nullable: true,
  })
  riderVerification?: RiderVerification;

  @OneToMany(() => Order, (order) => order.customer)
  customerOrders?: Order[];

  @OneToMany(() => Order, (order) => order.rider)
  riderOrders?: Order[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
