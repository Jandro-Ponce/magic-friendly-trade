import { Injectable, ForbiddenException } from '@nestjs/common';
import { InventoryItemRepository } from '../repository/inventory-item.repository';
import { InventoryItem } from '../entity/inventory-item.entity';

@Injectable()
export class InventoryService {
  constructor(private readonly repository: InventoryItemRepository) {}

  findByUser(userId: string): Promise<InventoryItem[]> {
    return this.repository.findByUser(userId);
  }

  findById(id: string): Promise<InventoryItem | null> {
    return this.repository.findById(id);
  }

  create(data: Partial<InventoryItem>): Promise<InventoryItem> {
    return this.repository.createAndSave(data);
  }

  async update(
    userId: string,
    id: string,
    data: Partial<InventoryItem>,
  ): Promise<InventoryItem> {
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
