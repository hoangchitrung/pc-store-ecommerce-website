import { IsNotEmpty } from '@nestjs/class-validator';

export class CreateOrderDto {
  @IsNotEmpty()
  shipping_address!: string;
  @IsNotEmpty()
  recipient_name!: string;
  @IsNotEmpty()
  recipient_phone!: string;
}
