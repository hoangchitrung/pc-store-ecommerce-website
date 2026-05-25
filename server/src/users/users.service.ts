import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

      const userData = {
        ...createUserDto,
        password: hashedPassword,
      };

      const newUser = this.userRepository.create(userData);
      return this.userRepository.save(newUser);
    } catch (error) {
      return (error as Error).message;
    }
  }

  findAll() {
    try {
      return this.userRepository.find();
    } catch (error) {
      return (error as Error).message;
    }
  }

  async findOne(id: number) {
    try {
      const user = await this.userRepository.findOneBy({ id });
      if (!user) {
        throw new NotFoundException('This user is not exists');
      }
      return user;
    } catch (error) {
      return (error as Error).message;
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.findOne(id);
      const updateUser = Object.assign(user, updateUserDto);
    } catch (error) {
      return (error as Error).message;
    }
  }
}
