import { Module } from '@nestjs/common';
import { ProductsSerialNumbersService } from './products_serial_numbers.service';
import { ProductsSerialNumbersController } from './products_serial_numbers.controller';

@Module({
  controllers: [ProductsSerialNumbersController],
  providers: [ProductsSerialNumbersService],
})
export class ProductsSerialNumbersModule {}
