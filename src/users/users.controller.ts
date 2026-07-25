import {
  Controller,
  Get,
  Body,
  Patch,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @Roles(Role.Customer, Role.Rider, Role.Admin)
  getProfile(@Request() req: any) {
    const userId = req.user.id || req.user.userId || req.user.sub;
    return this.usersService.findProfile(userId);
  }

  @Patch('profile')
  @Roles(Role.Customer, Role.Rider, Role.Admin)
  updateProfile(@Request() req: any, @Body() dto: UpdateUserDto) {
    const userId = req.user.id || req.user.userId || req.user.sub;
    return this.usersService.updateProfile(userId, dto);
  }
}
