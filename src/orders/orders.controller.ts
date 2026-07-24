import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Order } from './entities/order.entity';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // new order by customr 
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('customer')
  @Post('create')
  createOrder(
    @Body() createOrderDto: CreateOrderDto,
    @Req() req: any,
  ): Promise<Order> {

    return this.ordersService.createOrder(createOrderDto, req.user);
  }

  // order details edit by customer
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('customer')
  @Patch('customer/edit/:id')
  editOrder(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderDto: UpdateOrderDto,
    @Req() req: any,
  ): Promise<Order> {
    return this.ordersService.editOrder(id, updateOrderDto, req.user);
  }

  // Order cancel by customer
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('customer')
  @Delete('customer/cancel/:id')
  cancelOrder(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: any,
  ): Promise<string> {
    return this.ordersService.cancelOrder(id, req.user);
  }

  //customer-orders history check
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('customer')
  @Get('customer/history')
  getCustomerHistory(@Req() req: any): Promise<Order[]> {
    return this.ordersService.getCustomerHistory(req.user);
  }
}
