import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn()
  id!: number;

//   @ManyToOne(
}
