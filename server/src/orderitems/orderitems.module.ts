import { Module } from '@nestjs/common';
import { OrderitemsService } from './orderitems.service';
import { OrderitemsController } from './orderitems.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderItem } from './orderitem.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrderItem])],
  controllers: [OrderitemsController],
  providers: [OrderitemsService],
  exports: [OrderitemsService],
})
export class OrderitemsModule {}
