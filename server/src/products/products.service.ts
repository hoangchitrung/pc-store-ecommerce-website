import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { Repository, Like } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  // CREATE: new product
  async create(createProductDto: CreateProductDto) {
    const newProduct: Product = this.productRepository.create(createProductDto);

    if (!newProduct) throw new BadRequestException('Error when create account');
    return await this.productRepository.save(newProduct);
  }

  // READ: get all users
  async findAll() {
    const products: Product[] = await this.productRepository.find();
    if (!products) throw new NotFoundException('This product is not exist');
    return products;
  }

  // READ: get specific user by ID
  async findOne(id: number) {
    const product: Product | null = await this.productRepository.findOneBy({
      id,
    });
    if (!product)
      throw new NotFoundException(`Not found product with id ${id}`);

    return product;
  }

  // UPDATE: update product information
  async update(id: number, updateProductDto: UpdateProductDto) {
    try {
      const product: Product = await this.findOne(id);
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
      const product: Product = await this.findOne(id);

      await this.productRepository.remove(product);
      return { message: `Removed product with id ${id}` };
    } catch (error) {
      return (error as Error).message;
    }
  }
  // search product by name with Like to be able to find product with similar name
  async findByName(name: string) {
    const products: Product[] = await this.productRepository.find({
      where: { name: Like(`%${name}%`) },
    });

    if (!products) throw new NotFoundException(`This product is not exist`);
    return products;
  }
  // search product by name with Like to be able to find product with similar category for sorting
  async findByCategory(category: string) {
    const products: Product[] = await this.productRepository.find({
      where: { category: Like(`%${category}%`) },
    });
    if (!products) throw new NotFoundException(`This product is not exist`);
    return products;
  }

  async findByBrand(brand: string) {
    const products: Product[] = await this.productRepository.find({
      where: { brand: Like(`%${brand}%`) },
    });
    if (!products) throw new NotFoundException(`This product is not exist`);
    return products;
  }

  async sortLowToHigh() {
    const products: Product[] | string = await this.findAll();

    if (!products) throw new NotFoundException('This product is not exist');

    const sortedProducts: Product[] = products.sort(
      (a, b) => a.price - b.price,
    );

    return sortedProducts;
  }

  async sortHighToLow() {
    const products: Product[] | string = await this.findAll();

    if (!products) throw new NotFoundException('This product is not exist');

    const sortedProducts: Product[] = products.sort(
      (a, b) => b.price - a.price,
    );

    return sortedProducts;
  }
}
