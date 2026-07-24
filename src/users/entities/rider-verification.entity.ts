import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { VerificationStatus } from '../../common/enums/verification-status.enum';

@Entity('rider_verifications')
export class RiderVerification {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, (user) => user.riderVerification, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: number;

  @Column()
  nidNumber: string;

  @Column()
  nidImagePath: string;

  @Column({
    type: 'enum',
    enum: VerificationStatus,
    default: VerificationStatus.Pending,
  })
  status: VerificationStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
