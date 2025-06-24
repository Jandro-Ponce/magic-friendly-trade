import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from 'src/user/entity/user.entity';
import { Card } from './card.entity';

@Entity()
export class WishlistItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { eager: true })
  user: User;

  @ManyToOne(() => Card, { eager: true })
  card: Card;

  @Column({ default: 1 })
  desiredQuantity: number;

  @Column({ default: 'indiferente' })
  language: string;

  @Column({ default: false })
  addToWishlist: boolean;
}
