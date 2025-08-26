import { Injectable, ForbiddenException } from '@nestjs/common';
import { InventoryItemRepository } from '../repository/inventory-item.repository';
import { InventoryItem } from '../entity/inventory-item.entity';
import { CardService } from './card.service';

@Injectable()
export class InventoryService {
  constructor(
    private readonly repository: InventoryItemRepository,
    private readonly cardService: CardService,
  ) {}

  findByUser(userId: string): Promise<InventoryItem[]> {
    return this.repository.findByUser(userId);
  }

  // Últimas N cartas listadas
  findLatestListed(limit: number): Promise<InventoryItem[]> {
    return this.repository.findLatestListed(limit);
  }

  // Últimas N cartas vendidas
  findLatestSold(limit: number): Promise<InventoryItem[]> {
    return this.repository.findLatestSold(limit);
  }

  findById(id: string): Promise<InventoryItem | null> {
    return this.repository.findById(id);
  }

  findByCard(cardId: string): Promise<InventoryItem[]> {
    return this.repository.findByCard(cardId);
  }

  async create(data: Partial<InventoryItem>): Promise<InventoryItem> {
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
