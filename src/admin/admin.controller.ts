import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
import { VerifyRiderDto } from './dto/verify-rider.dto';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Admin)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  getDashboardStats() {
    return this.adminService.getDashboardStats();
  }

  @Patch('verify-rider/:id')
  verifyRider(@Param('id') id: string, @Body() dto: VerifyRiderDto) {
    return this.adminService.verifyRider(parseInt(id, 10), dto);
  }

  @Patch('users/suspend/:id')
  suspendUser(@Param('id') id: string) {
    return this.adminService.suspendUser(parseInt(id, 10));
  }
}
