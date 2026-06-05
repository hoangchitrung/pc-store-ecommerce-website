import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from './payment.entity';
import { Repository } from 'typeorm';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Order } from '../orders/order.entity';
import { OrdersService } from '../orders/orders.service';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    private orderService: OrdersService,
  ) {}

  async create(order_id: number, createPaymentDto: CreatePaymentDto) {
    const order: Order = await this.orderService.findOne(order_id);
  }
}
