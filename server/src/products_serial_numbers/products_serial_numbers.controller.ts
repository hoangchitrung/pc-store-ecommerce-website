import { Body, Controller, Post } from '@nestjs/common';
import { ProductsSerialNumbersService } from './products_serial_numbers.service';
import { CreateProductSerialNumebr } from './dto/create-product-serial.dto';

@Controller('products-serial-numbers')
export class ProductsSerialNumbersController {
  constructor(
    private readonly productsSerialNumbersService: ProductsSerialNumbersService,
  ) {}

  @Post()
  createBatch(@Body() createProductSerialNumber: CreateProductSerialNumebr) {
    return this.productsSerialNumbersService.createBatch(
      createProductSerialNumber,
    );
  }
}
