import { ForbiddenException, Injectable } from '@nestjs/common';
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

  async create(userId: number, createPaymentDto: CreatePaymentDto) {
    const order: Order = await this.orderService.findOne(
      createPaymentDto.order_id,
    );

    if (order.user_id.id !== userId)
      throw new ForbiddenException(
        'You do not have permission to pay for this order',
      );

    const newPayment: Payment = this.paymentRepository.create({
      user_id: order.user_id,
      order_id: order,
      amount: order.total_price,
      status: 'pending',
      type: createPaymentDto.type,
    });

    await this.paymentRepository.save(newPayment);
    return newPayment;
  }
}
