import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './cart.entity';
import { Product } from '../products/product.entity';
import { CreateCartDto } from './dto/createCart.dto';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class CartsService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private usersService: UsersService,
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
      where: { user_id: { id: userId }, product_id: { id: product_id } },
    });

    if (existInCart) {
      // plus 1 to current quantiy in cart
      existInCart.quantity += quantity;
      return await this.cartRepository.save(existInCart);
    }

    // Not in cart, create new record
    const newItem = this.cartRepository.create({
      user_id: { id: userId },
      product_id: product,
      quantity: quantity,
    });

    return await this.cartRepository.save(newItem);
  }
  async findOne(id: number) {
    const cart: Cart | null = await this.cartRepository.findOneBy({ id });

    if (!cart) throw new NotFoundException('This cart is not exist!');
    return cart;
  }
  async findAll() {
    const carts: Cart[] = await this.cartRepository.find();

    if (!carts) throw new NotFoundException('Carts are empty!');

    return carts;
  }

  async findUserCart(userId: number) {
    const user: User = await this.usersService.findOne(userId);
    if (!user) throw new NotFoundException('User not found');

    const cart: Cart[] = await this.cartRepository.find({
      where: {
        user_id: {
          id: userId,
        },
      },
    });
    if (cart.length === 0)
      throw new NotFoundException('This user did not have any item in cart');

    return cart;
  }

  async increaseQuantity(id: number) {
    const cart: Cart = await this.findOne(id);

    if (!cart) throw new NotFoundException('This cart is not exist');

    return await this.cartRepository.increment({ id: id }, 'quantity', 1);
  }

  async decreaseQuantity(id: number) {
    const cart: Cart = await this.findOne(id);

    if (!cart) throw new NotFoundException('This cart is not exist');

    if (cart.quantity < 1)
      throw new BadRequestException('Quantity can not go below 0');

    return await this.cartRepository.decrement({ id: id }, 'quantity', 1);
  }

  async remove(id: number) {
    const cart: Cart = await this.findOne(id);

    if (!cart) throw new NotFoundException('This cart is not exist');
    return await this.cartRepository.remove(cart);
  }
}
