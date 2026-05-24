export class CreateProductDto {
  name!: string;
  brand!: string;
  category!: string;
  price!: number;
  image_url?: string;
  quantity?: number;
  description?: string;
}
