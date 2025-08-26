import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Not } from 'typeorm';
import { InventoryItem } from '../entity/inventory-item.entity';

@Injectable()
export class InventoryItemRepository {
  constructor(
    @InjectRepository(InventoryItem)
    private readonly repository: Repository<InventoryItem>,
  ) {}

  findByUser(userId: string): Promise<InventoryItem[]> {
    return this.repository.find({ where: { user: { id: userId } } });
  }

  // Últimas N cartas listadas (por fecha de creación)
  async findLatestListed(limit: number): Promise<InventoryItem[]> {
    return this.repository.find({
      order: { id: 'DESC' }, // Si hay campo de fecha, usarlo
      take: limit,
    });
  }

  // Últimas N cartas vendidas (por fecha de venta)
  async findLatestSold(limit: number): Promise<InventoryItem[]> {
    // Filtrar por soldAt no nulo usando FindOptionsWhere
    return this.repository.find({
      where: { soldAt: Not(null) },
      order: { soldAt: 'DESC' },
      take: limit,
    });
  }

  findById(id: string): Promise<InventoryItem | null> {
    return this.repository.findOne({ where: { id } });
  }

  findByCard(cardId: string): Promise<InventoryItem[]> {
    return this.repository.find({ where: { card: { id: cardId } } });
  }

  async createAndSave(data: Partial<InventoryItem>): Promise<InventoryItem> {
    const item = this.repository.create(data);
    return this.repository.save(item);
  }

  async update(id: string, data: Partial<InventoryItem>): Promise<InventoryItem> {
    await this.repository.update(id, data);
    return this.repository.findOneBy({ id });
  }

  async remove(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
