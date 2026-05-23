import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true, length: 100 })
  email!: string;

  @Column({ length: 255 })
  password!: string;

  @Column({ length: 100, nullable: true })
  full_name?: string;

  @Column({ type: 'int', nullable: true })
  phone_number?: number;

  @Column({ length: 255, nullable: true })
  address?: string;

  @Column({ length: 255, nullable: true })
  image_url?: string;

  @Column({ default: 'customer' })
  role!: string;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
