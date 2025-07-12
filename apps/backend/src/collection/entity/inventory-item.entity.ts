import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from 'src/user/entity/user.entity';
import { Card } from './card.entity';

@Entity()
export class InventoryItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { eager: true })
  user: User;

  @ManyToOne(() => Card, { eager: true })
  card: Card;

  @Column({ default: 1 })
  quantity: number;

  @Column({ default: false })
  foil: boolean;

  @Column({ default: false })
  signed: boolean;

  @Column({ nullable: true })
  comment?: string;
}
