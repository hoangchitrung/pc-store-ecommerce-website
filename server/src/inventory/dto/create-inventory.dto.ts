import { IsInt, IsNotEmpty, IsString } from '@nestjs/class-validator';

export class CreateInventoryDto {
  @IsInt()
  @IsNotEmpty()
  product_id!: number;
  @IsString()
  @IsNotEmpty()
  location?: string;
}
