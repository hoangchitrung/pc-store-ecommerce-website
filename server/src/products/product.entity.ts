import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  UpdateDateColumn,
} from 'typeorm';
import { PrimaryGeneratedColumn } from 'typeorm/browser';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 255 })
  @Index('idx_name')
  name!: string;

  @Column({ length: 100 })
  @Index('idx_brand')
  brand!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ length: 100 })
  @Index('idx_category')
  category!: string;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  price!: number;

  @Column({ type: 'int', default: 0 })
  quantity!: number;

  @Column({ length: 255, nullable: true })
  image_url?: string;

  @Column({
    type: 'int',
    nullable: true,
    comment: 'Power Consumption (TDP) in Watt',
  })
  tdp?: number;

  @Column({ type: 'json', nullable: true })
  specification?: any;

  @Column({ type: 'boolean', default: false })
  serial_number_required!: boolean;

  @Column({ type: 'boolean', default: true })
  is_active!: boolean;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
