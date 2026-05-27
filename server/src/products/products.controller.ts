import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productService: ProductsService) {}

  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Get(':id') // Catch get request
  findOne(@Param('id') id: string) {
    return this.productService.findOne(Number(id));
  }

  @Get('/search/:name')
  findByName(@Param('name') name: string) {
    return this.productService.findByName(name.toLowerCase());
  }

  @Get('/sort/low-to-high')
  sortLowToHigh() {
    return this.productService.sortLowToHigh();
  }

  @Get('/sort/high-to-low')
  sortHighToLow() {
    return this.productService.sortHighToLow();
  }

  @Get('/category/:category')
  findByCategory(@Param('category') category: string) {
    return this.productService.findByCategory(category.toLowerCase());
  }

  @Get('/brand/:brand')
  findByBrand(@Param('brand') brand: string) {
    return this.productService.findByBrand(brand.toLowerCase());
  }

  @Post() // Catch request as post to create
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(Number(id), updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(Number(id));
  }
}
