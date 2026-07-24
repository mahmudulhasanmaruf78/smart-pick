import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { RolesGuard } from './roles.guard';

@Module({
  imports: [
    UsersModule, // Imports UsersService so AuthService can use it
    JwtModule.registerAsync({
      global: true,
      secret: 'hasnain', // Secret key for token encryption
      signOptions: { expiresIn: '1d' }, // Token valid for 24 hours
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule { }
