import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    OneToOne,
} from 'typeorm';
import { RiderVerification } from './rider-verification.entity';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'varchar',
        length: 255,
    })
    name: string;

    @Column({
        type: 'varchar',
        length: 255,
        unique: true, // Prevents duplicate email signups
    })
    email: string;

    @Column({
        type: 'varchar',
        length: 11,
        unique: true, // Prevents duplicate phone signups
    })
    phone: string; // Stored as string to preserve leading '0'

    @Column({
        type: 'varchar',
        length: 255,
    })
    password: string;

    @Column({
        type: 'enum',
        enum: ['customer', 'rider', 'admin'],
    })
    role: 'customer' | 'rider' | 'admin';

    @Column({ type: 'boolean', default: true })
    isActive: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    // Relations
    @OneToOne(() => RiderVerification, (verification) => verification.rider)
    verification: RiderVerification;
}
