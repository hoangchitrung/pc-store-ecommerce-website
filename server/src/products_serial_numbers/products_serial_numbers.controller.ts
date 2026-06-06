import { Controller } from '@nestjs/common';
import { ProductsSerialNumbersService } from './products_serial_numbers.service';

@Controller('products-serial-numbers')
export class ProductsSerialNumbersController {
  constructor(
    private readonly productsSerialNumbersService: ProductsSerialNumbersService,
  ) {}
}
