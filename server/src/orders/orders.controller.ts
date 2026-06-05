import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(
    @Query('userId') userId: string,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    return this.ordersService.create(Number(userId), createOrderDto);
  }

  @Patch('/update-status/:id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.updateOrderStatus(Number(id), updateOrderDto);
  }

  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(Number(id));
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(Number(id));
  }
}
