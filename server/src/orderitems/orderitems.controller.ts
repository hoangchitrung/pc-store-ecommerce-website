import { Controller } from '@nestjs/common';
import { OrderitemsService } from './orderitems.service';

@Controller('orderitems')
export class OrderitemsController {
  constructor(private readonly orderitemsService: OrderitemsService) {}
}
