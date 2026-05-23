export class CreateProductDto {
  name!: string;
  brand!: string;
  category!: string;
  price!: number;
  quantity?: number;
  description?: string;
}
