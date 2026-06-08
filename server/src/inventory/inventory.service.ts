import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Inventory } from './inventory.entity';
import { Repository } from 'typeorm';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { ProductsService } from '../products/products.service';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Inventory)
    private inventoryRepository: Repository<Inventory>,
    private productService: ProductsService,
  ) {}

  async findAll() {
    const inventory: Inventory[] = await this.inventoryRepository.find();

    if (inventory.length === 0)
      throw new NotFoundException('Inventory are empty');

    return inventory;
  }

  async findOne(id: number) {
    const inventory: Inventory | null = await this.inventoryRepository.findOne({
      where: { id: id },
    });

    if (!inventory) throw new NotFoundException('Inventory not found');
    return inventory;
  }

  async remove(id: number) {
    const inventory = await this.inventoryRepository.delete({ id });
    if (inventory.affected === 0)
      throw new NotFoundException('Inventory not found');
    return { message: 'Deleted Successfully' };
  }

  async create(createInventoryDto: CreateInventoryDto) {
    try {
      const newInventory: Inventory = this.inventoryRepository.create({
        product_id: {
          id: createInventoryDto.product_id,
        },
        location: createInventoryDto.location,
      });
      await this.inventoryRepository.save(newInventory);
      return newInventory;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
