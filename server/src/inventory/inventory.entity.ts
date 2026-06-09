import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Product } from '../products/product.entity';

@Entity('inventory')
export class Inventory {
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToOne(() => Product, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product!: Product;

  @Column({
    type: 'int',
    default: 0,
    comment: 'Số lượng sản phẩm còn trong kho',
  })
  available_quantity!: number;

  @Column({
    type: 'int',
    default: 0,
    comment: 'Số lượng khách hàng đặt sản phẩm',
  })
  reserved_quantity!: number;

  @Column({
    type: 'int',
    default: 5,
    comment: 'Số lượng sản phẩm cánh bảo hết hàng',
  })
  minimum_quantity!: number;

  @Column({ length: 100, nullable: true })
  location?: string;

  @UpdateDateColumn()
  updated_at!: Date;
}
