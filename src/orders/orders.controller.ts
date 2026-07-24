import {
  Controller,
  Get,
  Patch,
  Param,
  Query,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { RiderVerifiedGuard } from '../common/guards/rider-verified.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { FindAvailableOrdersDto } from './dto/find-available-orders.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import type { AuthenticatedRequest } from '../common/interfaces/authenticated-request.interface';

@Controller('orders')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // ---- RIDER LOGIC ----

  @Get('available')
  @Roles(Role.Rider)
  @UseGuards(RiderVerifiedGuard)
  findAvailable(@Query() query: FindAvailableOrdersDto) {
    return this.ordersService.findAvailable(query);
  }

  @Patch('accept/:id')
  @Roles(Role.Rider)
  @UseGuards(RiderVerifiedGuard)
  accept(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.ordersService.acceptOrder(Number(id), req.user);
  }

  @Patch('status/:id')
  @Roles(Role.Rider)
  @UseGuards(RiderVerifiedGuard)
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateOrderStatusDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.ordersService.updateStatus(Number(id), dto, req.user);
  }
}
