import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { Product } from './products/product.entity';
import { Cart } from './carts/cart.entity';
import { Order } from './orders/order.entity';
import { OrderItem } from './orderitems/orderitem.entity';
import { Payment } from './payments/payment.entity';
import { Inventory } from './inventory/inventory.entity';
import { ProductSerialNumber } from './products_serial_numbers/product_serial_number.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mariadb',
      host: 'localhost',
      port: 3306,
      username: 'trunghoang_admin',
      password: '123456',
      database: 'pc_store',
      entities: [
        User,
        Product,
        Cart,
        Order,
        OrderItem,
        Payment,
        Inventory,
        ProductSerialNumber,
      ], // Contain entities class (add later)
      synchronize: true, // automatically create and sync from code to DB
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
