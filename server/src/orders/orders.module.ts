import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { CartsModule } from '../carts/carts.module';
import { OrderitemsModule } from '../orderitems/orderitems.module';

@Module({
  imports: [TypeOrmModule.forFeature([Order]), CartsModule, OrderitemsModule],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
