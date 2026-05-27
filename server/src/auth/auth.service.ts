import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private authRepository: Repository<User>,
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(
    email: string,
    password: string,
  ): Promise<{ access_token: string }> {
    if (!email || !password) {
      throw new BadRequestException('Ensure that you are fill the form');
    }
    const user = await this.userService.findByEmail(email);
    if (!user) throw new NotFoundException('This account does not exist');
    const compare = await bcrypt.compare(password, user.password);

    if (!compare)
      throw new UnauthorizedException(`Your password is incorrect!`);
    const payload = { sub: user.id, email: user.email };
    return {
      // Here the JWT secret key that's used for signging the payload
      // is the that was passed in the JwtModule
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async signUp(createUserDto: CreateUserDto) {
    const userExist = await this.userService.findByEmail(createUserDto.email);

    if (userExist) throw new ConflictException('This email is already exist');

    const newUser = await this.userService.create(createUserDto);

    if (newUser) return 'Register successfully';
    throw new BadRequestException('There is something wrong');
  }
}
