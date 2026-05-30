import { Module } from '@nestjs/common';
import { CartsService } from './carts.service';
import { CartsController } from './carts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './cart.entity';
import { Product } from '../products/product.entity';
import { AuthModule } from '../auth/auth.module';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cart, Product, User]), AuthModule],
  controllers: [CartsController],
  providers: [CartsService, UsersService],
})
export class CartsModule {}
