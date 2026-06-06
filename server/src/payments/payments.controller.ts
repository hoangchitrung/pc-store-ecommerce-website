import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post(':id')
  create(@Query('id') id: string, @Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentsService.create(Number(id), createPaymentDto);
  }

  @Post('/mock-success/:id')
  success(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
    return this.paymentsService.mock_success(Number(id), updatePaymentDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentsService.findOne(Number(id));
  }

  @Get()
  findAll() {
    return this.paymentsService.findAll();
  }

  @Delete(':id')
  remove(id: string) {
    return this.paymentsService.remove(Number(id));
  }
}
