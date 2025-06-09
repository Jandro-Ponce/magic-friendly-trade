import { Injectable } from '@nestjs/common';
import { WishlistItemRepository } from '../repository/wishlist-item.repository';
import { WishlistItem } from '../entity/wishlist-item.entity';

@Injectable()
export class WishlistService {
  constructor(private readonly repository: WishlistItemRepository) {}

  findByUser(userId: string): Promise<WishlistItem[]> {
    return this.repository.findByUser(userId);
  }

  findById(id: string): Promise<WishlistItem | null> {
    return this.repository.findById(id);
  }

  create(data: Partial<WishlistItem>): Promise<WishlistItem> {
    return this.repository.createAndSave(data);
  }

  update(id: string, data: Partial<WishlistItem>): Promise<WishlistItem> {
    return this.repository.update(id, data);
  }

  remove(id: string): Promise<void> {
    return this.repository.remove(id);
  }
}
