import { IsNotEmpty, IsString } from '@nestjs/class-validator';

export class UpdateOrderDto {
  @IsString()
  @IsNotEmpty()
  status!: string;
}
