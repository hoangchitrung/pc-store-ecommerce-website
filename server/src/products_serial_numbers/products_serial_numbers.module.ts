import { Module } from '@nestjs/common';
import { ProductsSerialNumbersService } from './products_serial_numbers.service';
import { ProductsSerialNumbersController } from './products_serial_numbers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductSerialNumber } from './product_serial_number.entity';
import { InventoryModule } from '../inventory/inventory.module';

@Module({
  imports: [TypeOrmModule.forFeature([ProductSerialNumber]), InventoryModule],
  controllers: [ProductsSerialNumbersController],
  providers: [ProductsSerialNumbersService],
})
export class ProductsSerialNumbersModule {}
