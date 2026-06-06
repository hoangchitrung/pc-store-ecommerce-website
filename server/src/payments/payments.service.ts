import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from './payment.entity';
import { Repository } from 'typeorm';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Order } from '../orders/order.entity';
import { OrdersService } from '../orders/orders.service';
import { UpdatePaymentDto } from './dto/update-payment.dto';

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

  async findOne(paymentId: number) {
    const payment: Payment | null = await this.paymentRepository.findOne({
      where: { id: paymentId },
      relations: {
        user_id: true,
        order_id: true,
      },
    });

    if (!payment) throw new NotFoundException('Payment not found');

    return payment;
  }

  async findAll() {
    const payments: Payment[] = await this.paymentRepository.find();

    if (payments.length === 0)
      throw new NotFoundException('Payments are empty!');
    return payments;
  }

  async remove(id: number) {
    const payment: Payment = await this.findOne(id);

    await this.paymentRepository.remove(payment);
  }

  async mock_success(paymentId: number, updatePaymentDto: UpdatePaymentDto) {
    const payment: Payment = await this.findOne(paymentId);

    const updatePayment = Object.assign(payment, updatePaymentDto);
    await this.paymentRepository.save(updatePayment);
    return updatePayment;
  }
}
