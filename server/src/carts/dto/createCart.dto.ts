import { IsInt, IsPositive } from '@nestjs/class-validator';

export class CreateCartDto {
  @IsInt()
  product_id!: number;
  @IsPositive()
  @IsInt()
  quantity!: number;
}
