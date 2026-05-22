import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrderItem } from '../orderitems/orderitem.entity';
import { User } from '../users/user.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id!: number;

  // pending, processing, shipped, delivered, cancelled
  @Column({ default: 'pending' })
  status!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  total_price!: number;

  @Column({ length: 255 })
  shipping_address!: string;

  @Column({ length: 100 })
  recipient_name!: string;

  @Column({ length: 20 })
  recipient_phone!: string;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  orderItem!: OrderItem[];
}
