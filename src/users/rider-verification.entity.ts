import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToOne,
    JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('rider_verifications')
export class RiderVerification {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 10 })
    nidNumber: string;

    @Column({ type: 'varchar', length: 500 })
    nidImage: string; // Stores local file path of uploaded NID image

    @Column({
        type: 'enum',
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
    })
    status: 'pending' | 'approved' | 'rejected';

    @OneToOne(() => User, (user) => user.verification, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'rider_id' }) // Foreign Key column in PostgreSQL
    rider: User;
}
