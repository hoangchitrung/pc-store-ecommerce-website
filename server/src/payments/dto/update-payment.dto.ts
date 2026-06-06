import { IsNotEmpty, IsString } from '@nestjs/class-validator';

export class UpdatePaymentDto {
  @IsString()
  @IsNotEmpty()
  status!: string;
}
