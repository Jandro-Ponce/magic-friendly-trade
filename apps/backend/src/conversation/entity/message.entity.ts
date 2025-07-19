import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn } from 'typeorm';
import { Conversation } from './conversation.entity';
import { User } from 'src/user/entity/user.entity';

@Entity()
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Conversation, { eager: true })
  conversation: Conversation;

  @ManyToOne(() => User, { eager: true })
  sender: User;

  @Column()
  content: string;

  @CreateDateColumn()
  createdAt: Date;
}
