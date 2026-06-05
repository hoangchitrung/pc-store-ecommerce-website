import { IsNotEmpty, IsNumber, IsString } from '@nestjs/class-validator';

export class CreatePaymentDto {
  @IsNumber()
  @IsNotEmpty()
  order_id!: number;
  @IsString()
  @IsNotEmpty()
  type!: string;
}
