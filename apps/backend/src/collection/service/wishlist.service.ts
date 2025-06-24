import { Injectable, ForbiddenException } from '@nestjs/common';
import { WishlistItemRepository } from '../repository/wishlist-item.repository';
import { WishlistItem } from '../entity/wishlist-item.entity';
import { CardService } from './card.service';

@Injectable()
export class WishlistService {
  constructor(
    private readonly repository: WishlistItemRepository,
    private readonly cardService: CardService,
  ) {}

  findByUser(userId: string): Promise<WishlistItem[]> {
    return this.repository.findByUser(userId);
  }

  findById(id: string): Promise<WishlistItem | null> {
    return this.repository.findById(id);
  }

  async create(data: Partial<WishlistItem>): Promise<WishlistItem> {
    if (data.card) {
      const existing = await this.cardService.findById(data.card.id);
      if (!existing) {
        await this.cardService.create(data.card as any);
      }
    }
    return this.repository.createAndSave(data);
  }

  async update(
    userId: string,
    id: string,
    data: Partial<WishlistItem>,
  ): Promise<WishlistItem> {
    const item = await this.repository.findById(id);
    if (!item || item.user.id !== userId) {
      throw new ForbiddenException();
    }
    return this.repository.update(id, data);
  }

  async remove(userId: string, id: string): Promise<void> {
    const item = await this.repository.findById(id);
    if (!item || item.user.id !== userId) {
      throw new ForbiddenException();
    }
    return this.repository.remove(id);
  }
}
