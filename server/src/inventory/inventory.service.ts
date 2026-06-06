import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Inventory } from './inventory.entity';
import { Repository } from 'typeorm';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { ProductsService } from '../products/products.service';
import { Product } from '../products/product.entity';

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

  async create(id: number, createInventoryDto: CreateInventoryDto) {
    const product: Product = await this.productService.findOne(id);

    const newInventory: Inventory = this.inventoryRepository.create({
      product_id: product,
      available_quantity: 0,
      reserved_quantity: 0,
      minimum_quantity: 5,
      location: createInventoryDto.location,
    });
  }
}
