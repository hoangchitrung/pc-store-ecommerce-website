import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderItem } from './orderitem.entity';
import { Repository } from 'typeorm';
import { Order } from '../orders/order.entity';
import { Cart } from '../carts/cart.entity';

@Injectable()
export class OrderitemsService {
  constructor(
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
  ) {}
  async create(order: Order, carts: Cart[]) {
    const orderItem: OrderItem[] = carts.map((cartItem) => {
      return this.orderItemRepository.create({
        order: order,
        product: cartItem.product_id,
        quantity: cartItem.quantity,
        price: cartItem.product_id.price,
      });
    });
    await this.orderItemRepository.save(orderItem);
  }
}
