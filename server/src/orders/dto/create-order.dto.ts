import { IsNotEmpty, IsString } from '@nestjs/class-validator';

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  shipping_address!: string;
  @IsString()
  @IsNotEmpty()
  recipient_name!: string;
  @IsString()
  @IsNotEmpty()
  recipient_phone!: string;
}
