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
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: configService.get<string>('TYPE_DB') as 'mariadb',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_POT'),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASS'),
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
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
