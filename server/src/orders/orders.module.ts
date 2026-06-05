import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { Cart } from '../carts/cart.entity';
import { OrderItem } from '../orderitems/orderitem.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Cart, OrderItem])],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
