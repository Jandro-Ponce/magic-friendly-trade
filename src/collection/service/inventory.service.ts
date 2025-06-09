import { Injectable } from '@nestjs/common';
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

  update(id: string, data: Partial<InventoryItem>): Promise<InventoryItem> {
    return this.repository.update(id, data);
  }

  remove(id: string): Promise<void> {
    return this.repository.remove(id);
  }
}
