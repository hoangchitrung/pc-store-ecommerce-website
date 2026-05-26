import { IsEmail, IsNotEmpty } from '@nestjs/class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'Incorrect format for Email!' })
  @IsNotEmpty({ message: 'Email can not be empty!' })
  email!: string;

  @IsNotEmpty({ message: 'Password can not be empty!' })
  password!: string;

  full_name?: string;

  phone_number?: number;

  address?: string;

  image_url?: string;

  role!: string;
}
