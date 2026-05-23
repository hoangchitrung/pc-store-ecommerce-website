import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productService: ProductsService) {}

  @Post() // Catch request as post to create
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get(':id') // Catch get request
  findOne(@Param('id') id: string) {
    return this.productService.findOne(Number(id));
  }

  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Put()
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(Number(id), updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    try {
      return this.productService.remove(Number(id));
    } catch (error) {
      console.error(error);
    }
  }
}
