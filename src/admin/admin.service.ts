import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'src/orders/entities/order.entity';
import { RiderVerification } from 'src/users/entities/rider-verification.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(RiderVerification)
    private readonly riderVerificationRepo: Repository<RiderVerification>,
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
  ) {}
  async verifyRider(userId: number, dto: VerifyRiderDto) {
    const riderVerification = await this.riderVerificationRepo.findOne({
      where: { user: { id: userId } },
    });

    if (!riderVerification) {
      throw new NotFoundException('Rider verification submission not found');
    }
    riderVerification.status = dto.status;
    return await this.riderVerificationRepo.save(riderVerification);
  }

  async suspendUser(userId: number) {
    const user = await this.userRepo.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.isSuspended = true;
    return await this.userRepo.save(user);
  }

  async;
}
