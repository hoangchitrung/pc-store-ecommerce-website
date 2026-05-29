import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './cart.entity';
import { Product } from '../products/product.entity';
import { CreateCartDto } from './dto/createCart.dto';

@Injectable()
export class CartsService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,

    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async addToCart(userId: number, createCartDto: CreateCartDto) {
    const { product_id, quantity }: CreateCartDto = createCartDto;
    // check if product is exist
    const product = await this.productRepository.findOneBy({
      id: product_id,
    });

    if (!product)
      throw new NotFoundException(
        `This product with id ${createCartDto.product_id} is not exist`,
      );

    // check if the product is in cart or not
    const existInCart = await this.cartRepository.findOne({
      where: { user: { id: userId }, product: { id: product_id } },
    });

    if (existInCart) {
      // plus 1 to current quantiy in cart
      existInCart.quantity += quantity;
      return await this.cartRepository.save(existInCart);
    }

    // Not in cart, create new record
    const newItem = this.cartRepository.create({
      user: { id: userId },
      product: product,
      quantity: quantity,
    });

    return await this.cartRepository.save(newItem);
  }

  remove(id: number) {}
}
