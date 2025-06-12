import { Injectable } from '@nestjs/common';
import { CardRepository } from '../repository/card.repository';
import { Card } from '../entity/card.entity';

@Injectable()
export class CardService {
  constructor(private readonly cardRepository: CardRepository) {}

  findAll(): Promise<Card[]> {
    return this.cardRepository.findAll();
  }

  findById(id: string): Promise<Card | null> {
    return this.cardRepository.findById(id);
  }

  create(data: Partial<Card>): Promise<Card> {
    return this.cardRepository.createAndSave(data);
  }

  update(id: string, data: Partial<Card>): Promise<Card> {
    return this.cardRepository.createAndSave({ id, ...data });
  }

  remove(id: string): Promise<void> {
    return this.cardRepository.remove(id);
  }
}
