import { Injectable } from '@nestjs/common';

@Injectable()
export class CardService {
  private readonly apiUrl = 'https://api.scryfall.com';

  async search(query: string): Promise<any> {
    const response = await fetch(
      `${this.apiUrl}/cards/search?q=${encodeURIComponent(query)}`,
    );

    if (!response.ok) {
      throw new Error('Failed to fetch cards');
    }

    return response.json();
  }
}
