import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { User } from '../users/entities/user.entity';
import { Order } from '../orders/entities/order.entity';
import { RiderVerification } from '../users/entities/rider-verification.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, RiderVerification, Order])],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
