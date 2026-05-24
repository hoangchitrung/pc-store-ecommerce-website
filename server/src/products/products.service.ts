import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  // CREATE: new product
  create(createProductDto: CreateProductDto) {
    try {
      const newProduct = this.productRepository.create(createProductDto);
      return this.productRepository.save(newProduct);
    } catch (error) {
      return (error as Error).message;
    }
  }

  // READ: get all users
  findAll() {
    try {
      return this.productRepository.find();
    } catch (error) {
      return (error as Error).message;
    }
  }

  // READ: get specific user by ID
  async findOne(id: number) {
    try {
      const product = await this.productRepository.findOneBy({ id });
      if (!product)
        throw new NotFoundException(`Not found product with id ${id}`);
      return product;
    } catch (error) {
      return (error as Error).message;
    }
  }

  // UPDATE: update product information
  async update(id: number, updateProductDto: UpdateProductDto) {
    try {
      const product = await this.findOne(id);
      // overrite the old fields
      Object.assign(product, updateProductDto);
      return this.productRepository.save(product);
    } catch (error) {
      return (error as Error).message;
    }
  }

  // DELETE: remove product by id
  async remove(id: number) {
    try {
      const product = await this.findOne(id);

      return this.productRepository.delete(product);
    } catch (error) {
      return (error as Error).message;
    }
  }
}
