import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conversation } from '../entity/conversation.entity';

@Injectable()
export class ConversationRepository {
  constructor(
    @InjectRepository(Conversation)
    private readonly repository: Repository<Conversation>,
  ) {}

  findByUser(userId: string): Promise<Conversation[]> {
    return this.repository.find({
      where: [{ user1: { id: userId } }, { user2: { id: userId } }],
    });
  }

  findById(id: string): Promise<Conversation | null> {
    return this.repository.findOne({ where: { id } });
  }

  findBetween(user1Id: string, user2Id: string): Promise<Conversation | null> {
    return this.repository.findOne({
      where: [
        { user1: { id: user1Id }, user2: { id: user2Id } },
        { user1: { id: user2Id }, user2: { id: user1Id } },
      ],
    });
  }

  async createAndSave(data: Partial<Conversation>): Promise<Conversation> {
    const conversation = this.repository.create(data);
    return this.repository.save(conversation);
  }
}
