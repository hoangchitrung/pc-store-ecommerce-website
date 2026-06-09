import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductSerialNumber } from './product_serial_number.entity';
import { InventoryService } from '../inventory/inventory.service';
import { Repository } from 'typeorm';
import { CreateProductSerialNumebr } from './dto/create-product-serial.dto';

@Injectable()
export class ProductsSerialNumbersService {
  constructor(
    @InjectRepository(ProductSerialNumber)
    private serialRepository: Repository<ProductSerialNumber>,
    private inventoryService: InventoryService,
  ) {}

  async createBatch(dto: CreateProductSerialNumebr) {
    const serialsToSave = dto.serials.map((serialNumber) => {
      return this.serialRepository.create({
        product: { id: dto.product_id },
        serial_number: serialNumber,
        status: 'in_stock',
      });
    });

    try {
      const savedSerial = await this.serialRepository.save(serialsToSave);
      await this.inventoryService.increaseStock(
        dto.product_id,
        savedSerial.length,
      );

      return { message: `Added ${savedSerial.length} serial` };
    } catch (error) {
      return error as Error;
    }
  }
}
