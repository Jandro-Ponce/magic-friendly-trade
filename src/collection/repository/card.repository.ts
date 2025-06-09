import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Card } from '../entity/card.entity';

@Injectable()
export class CardRepository {
  constructor(
    @InjectRepository(Card)
    private readonly repository: Repository<Card>,
  ) {}

  findAll(): Promise<Card[]> {
    return this.repository.find();
  }

  findById(id: string): Promise<Card | null> {
    return this.repository.findOneBy({ id });
  }

  async createAndSave(data: Partial<Card>): Promise<Card> {
    const card = this.repository.create(data);
    return this.repository.save(card);
  }

  async remove(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
