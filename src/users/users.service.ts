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
        private readonly verificationRepository: Repository<RiderVerification>,
    ) { }


    async findByIdentity(identity: string): Promise<User | null> {
        return await this.userRepository.findOne({
            where: [{ email: identity }, { phone: identity }],
        });
    }


    async createCustomer(userData: Partial<User>): Promise<User> {
        const newUser = this.userRepository.create({
            ...userData,
            role: 'customer',
        });
        return await this.userRepository.save(newUser);
    }


    async createRider(
        userData: Partial<User>,
        nidNumber: string,
        nidImage: string,
    ): Promise<User> {

        const newRider = this.userRepository.create({
            ...userData,
            role: 'rider',
        });
        const savedRider = await this.userRepository.save(newRider);

        const verification = this.verificationRepository.create({
            nidNumber,
            nidImage,
            status: 'pending',
            rider: savedRider,
        });
        await this.verificationRepository.save(verification);

        return savedRider;
    }

}
