import { IsNotEmpty, IsNumber, IsString } from '@nestjs/class-validator';

export class CreateProductSerialNumebr {
  @IsNumber()
  @IsNotEmpty()
  product_id!: number;
  @IsString()
  @IsNotEmpty()
  serials!: string[]; // Ex: ["001", "002", "003"]
}
