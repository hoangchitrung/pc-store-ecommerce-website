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
    const hashedPassword: string = await bcrypt.hash(
      createUserDto.password,
      10,
    );

    const userData = {
      ...createUserDto,
      password: hashedPassword,
    };

    const newUser: User = this.userRepository.create(userData);
    return this.userRepository.save(newUser);
  }

  async findAll() {
    const users: User[] = await this.userRepository.find();
    if (!users) throw new NotFoundException('There are no users');
    return users;
  }

  async findOne(id: number) {
    const user: User | null = await this.userRepository.findOneBy({ id });

    if (!user)
      throw new NotFoundException(`This user with id ${id} is not exists`);
    return user;
  }

  async findByEmail(email: string) {
    const user: User | null = await this.userRepository.findOneBy({ email });

    if (!user) return null;
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user: User | null = await this.findOne(id);

    if (!user) throw new NotFoundException('User not found');

    const updateUser = Object.assign(user, updateUserDto);
    return this.userRepository.save(updateUser);
  }

  async remove(id: number) {
    const user: User | null = await this.findOne(id);

    if (!user) throw new NotFoundException('User not found');
    return this.userRepository.remove(user);
  }
}
