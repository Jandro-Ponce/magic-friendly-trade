import { Injectable, ForbiddenException } from '@nestjs/common';
import { ConversationRepository } from '../repository/conversation.repository';
import { MessageRepository } from '../repository/message.repository';
import { Conversation } from '../entity/conversation.entity';
import { Message } from '../entity/message.entity';

@Injectable()
export class ConversationService {
  constructor(
    private readonly conversationRepo: ConversationRepository,
    private readonly messageRepo: MessageRepository,
  ) {}

  findConversations(userId: string): Promise<Conversation[]> {
    return this.conversationRepo.findByUser(userId);
  }

  async getMessages(userId: string, conversationId: string): Promise<Message[]> {
    const conv = await this.conversationRepo.findById(conversationId);
    if (!conv || (conv.user1.id !== userId && conv.user2.id !== userId)) {
      throw new ForbiddenException();
    }
    return this.messageRepo.findByConversation(conversationId);
  }

  async sendMessage(
    userId: string,
    conversationId: string,
    content: string,
  ): Promise<Message> {
    const conv = await this.conversationRepo.findById(conversationId);
    if (!conv || (conv.user1.id !== userId && conv.user2.id !== userId)) {
      throw new ForbiddenException();
    }
    return this.messageRepo.createAndSave({
      conversation: conv,
      sender: { id: userId } as any,
      content,
    });
  }
}
