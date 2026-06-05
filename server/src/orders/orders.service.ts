import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { Cart } from '../carts/cart.entity';
import { UpdateOrderDto } from './dto/update-order.dto';
import { CartsService } from '../carts/carts.service';
import { OrderitemsService } from '../orderitems/orderitems.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    private cartsService: CartsService,
    private orderitemsService: OrderitemsService,
  ) {}

  async create(userId: number, createOrderDto: CreateOrderDto) {
    const carts: Cart[] = await this.cartsService.findUserCart(userId);

    if (carts.length === 0)
      throw new BadRequestException('Cart empty, can not order');

    if (
      !createOrderDto.recipient_name ||
      !createOrderDto.recipient_phone ||
      !createOrderDto.shipping_address
    )
      throw new NotFoundException('We can not find your info, please fill it');

    let totalPrice = 0;
    carts.forEach((cartItem) => {
      // cartItem.product_id.price will get the price property through cart join product
      totalPrice += cartItem.quantity * cartItem.product_id.price;
    });

    const newOrder: Order = this.orderRepository.create({
      user_id: { id: userId },
      recipient_name: createOrderDto.recipient_name,
      recipient_phone: createOrderDto.recipient_phone,
      shipping_address: createOrderDto.shipping_address,
      total_price: totalPrice,
    });

    const savedOrder: void = await this.orderitemsService.create(
      newOrder,
      carts,
    );
    await this.cartsService.removeByCart(userId);
    return savedOrder;
  }

  async remove(id: number) {
    const order: Order | null = await this.orderRepository.findOneBy({ id });

    if (!order) throw new NotFoundException('Order not found');
    await this.orderRepository.remove(order);
    return;
  }

  async findAll() {
    const orders: Order[] = await this.orderRepository.find();

    if (!orders) throw new NotFoundException('Orders are empty!');
    return orders;
  }

  async findOne(id: number) {
    const order: Order | null = await this.orderRepository.findOne({
      where: { id },
      relations: {
        user_id: true,
      },
    });

    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async updateOrderStatus(id: number, updateOrderDto: UpdateOrderDto) {
    const order: Order = await this.findOne(id);

    const updatedOrder = Object.assign(order, updateOrderDto);
    await this.orderRepository.save(updatedOrder);
    return updatedOrder;
  }
}
