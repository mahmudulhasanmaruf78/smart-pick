import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { RiderVerification } from './rider-verification.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(RiderVerification)
        private readonly riderVerificationRepository: Repository<RiderVerification>
    ) { }

    async findByIdentity(identity: string): Promise<User | null> {
        return this.userRepository.findOne({
            where: [
                { email: identity },
                { phone: identity },
            ]
        })
    }

    async createCustomer(userData: Partial<User>): Promise<User> {
        const newUser = this.userRepository.create({
            ...userData,
            role: 'customer',

        });
        return await this.userRepository.save(newUser);
    }

}
