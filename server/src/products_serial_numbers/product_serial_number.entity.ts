import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Product } from '../products/product.entity';
import { OrderItem } from '../orderitems/orderitem.entity';

@Entity('product_serial_number')
export class ProductSerialNumber {
  @PrimaryGeneratedColumn()
  id!: number;

  // cùng 1 loại sản phẩm sẽ có nhiều serials. Ex: VGA-3050-AAA, VGA-3050-BBB, ...
  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  @Index('idx_serial_product')
  product!: Product;

  // khi đặt hàng thì sẽ biết rõ sản phẩm được bán trong đơn hàng nào
  @ManyToOne(() => OrderItem, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'order_item_id' })
  @Index('idx_serial_order_item')
  orderitem!: OrderItem;

  @Column({ length: 100, unique: true })
  @Index('idx_serial_number')
  serial_number!: string;

  @Column({ length: 50, default: 'in_stock' })
  status!: string;

  @Column({ type: 'date', nullable: true })
  warranty_start!: Date;

  @Column({ type: 'date', nullable: true })
  warranty_end!: Date;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
