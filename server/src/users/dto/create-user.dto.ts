export class CreateUserDto {
  email!: string;
  password!: string;
  full_name?: string;
  phone_number?: number;
  address?: string;
  image_url?: string;
  role!: string;
}
