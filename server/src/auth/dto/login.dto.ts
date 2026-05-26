import { IsEmail, IsNotEmpty } from '@nestjs/class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Incorrect email format' })
  @IsNotEmpty({ message: 'Please enter your email' })
  email!: string;

  @IsNotEmpty({ message: 'Please enter your password' })
  password!: string;
}
