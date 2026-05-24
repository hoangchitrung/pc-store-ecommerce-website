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
    const product = await this.productRepository.findOneBy({ id });
    if (!product)
      throw new NotFoundException(`Not found product with id ${id}`);

    return product;
  }

  // UPDATE: update product information
  async update(id: number, updateProductDto: UpdateProductDto) {
    try {
      const product = await this.findOne(id);
      // overrite the old fields
      const updatedProduct = Object.assign(product, updateProductDto);
      return this.productRepository.save(updatedProduct);
    } catch (error) {
      return (error as Error).message;
    }
  }

  // DELETE: remove product by id
  // remove() is for object/entites
  // delete() just only delete by id
  async remove(id: number) {
    try {
      const product = await this.findOne(id);

      await this.productRepository.remove(product);
      return { message: `Removed product with id ${id}` };
    } catch (error) {
      return (error as Error).message;
    }
  }
}
