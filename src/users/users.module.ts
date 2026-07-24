import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { RiderVerification } from './entities/rider-verification.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, RiderVerification])],
  exports: [TypeOrmModule],
})
export class UsersModule {}
