import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from '../entity/message.entity';

@Injectable()
export class MessageRepository {
  constructor(
    @InjectRepository(Message)
    private readonly repository: Repository<Message>,
  ) {}

  findByConversation(conversationId: string): Promise<Message[]> {
    return this.repository.find({
      where: { conversation: { id: conversationId } },
      order: { createdAt: 'ASC' },
    });
  }

  async createAndSave(data: Partial<Message>): Promise<Message> {
    const msg = this.repository.create(data);
    return this.repository.save(msg);
  }
}
