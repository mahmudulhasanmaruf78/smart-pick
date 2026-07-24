import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { roles } from '../auth/roles.decorator';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    // Protected Endpoint: Requires valid JWT Token and role customer, rider, or admin
    @UseGuards(JwtAuthGuard, RolesGuard)
    @roles('customer', 'rider', 'admin')
    @Get('profile')
    getProfile(@Request() req) {
        return {
            message: 'Profile retrieved successfully',
            user: req.user,
        };
    }
}
