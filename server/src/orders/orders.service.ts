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
import { OrderItem } from '../orderitems/orderitem.entity';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
  ) {}

  async create(userId: number, createOrderDto: CreateOrderDto) {
    const carts: Cart[] = await this.cartRepository.find({
      where: { user_id: { id: userId } },
      relations: {
        product_id: true,
      },
    });

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

    const savedOrder: Order = await this.orderRepository.save(newOrder);

    const orderItem: OrderItem[] = carts.map((cartItem) => {
      return this.orderItemRepository.create({
        order: savedOrder,
        product: cartItem.product_id,
        quantity: cartItem.quantity,
        price: cartItem.product_id.price,
      });
    });
    await this.orderItemRepository.save(orderItem);
    await this.cartRepository.remove(carts);
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
    const order: Order | null = await this.orderRepository.findOneBy({ id });

    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async updateOrderStatus(id: number, updateOrderDto: UpdateOrderDto) {
    const order: Order | null = await this.findOne(id);

    const updatedOrder = Object.assign(order, updateOrderDto);
    await this.orderRepository.save(updatedOrder);
    return updatedOrder;
  }
}
