import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WishlistItem } from '../entity/wishlist-item.entity';

@Injectable()
export class WishlistItemRepository {
  constructor(
    @InjectRepository(WishlistItem)
    private readonly repository: Repository<WishlistItem>,
  ) {}

  findByUser(userId: string): Promise<WishlistItem[]> {
    return this.repository.find({ where: { user: { id: userId } } });
  }

  findById(id: string): Promise<WishlistItem | null> {
    return this.repository.findOne({ where: { id } });
  }

  async createAndSave(data: Partial<WishlistItem>): Promise<WishlistItem> {
    const item = this.repository.create(data);
    return this.repository.save(item);
  }

  async update(id: string, data: Partial<WishlistItem>): Promise<WishlistItem> {
    await this.repository.update(id, data);
    return this.repository.findOneBy({ id });
  }

  async remove(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
