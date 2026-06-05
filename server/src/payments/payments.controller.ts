import { Body, Controller, Post, Query } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post(':id')
  create(@Query('id') id: string, @Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentsService.create(Number(id), createPaymentDto);
  }
}
