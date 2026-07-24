import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class DeliveryZone {
    @PrimaryGeneratedColumn()
    id: number;

    // Zone Name
    @Column({ type: 'varchar', length: 100, unique: true })
    zoneName: string;

    //Regular delivery
    @Column({ type: 'decimal', precision: 10, scale: 2, default: 60 })
    baseRegularFare: number;

    // Express delivery
    @Column({ type: 'decimal', precision: 10, scale: 2, default: 120 })
    baseExpressFare: number;

    // Extra Weight Limit
    @Column({ type: 'decimal', precision: 5, scale: 2, default: 1 })
    weightLimit: number;

    // Extra Weight Rate
    @Column({ type: 'decimal', precision: 10, scale: 2, default: 20 })
    extraWeightRate: number;
}
