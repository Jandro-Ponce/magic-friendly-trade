import { Injectable } from '@nestjs/common';

@Injectable()
export class CardService {
  private readonly apiUrl = 'https://api.scryfall.com';

  async search(query: string): Promise<any> {
    const requesturl = `${this.apiUrl}/cards/search?q=${encodeURIComponent(query)}&include_multilingual=true`;
    const response = await fetch(requesturl);

    if (!response.ok) {
      console.log('URL:', requesturl);
      console.log('Error fetching cards:', response);
      throw new Error('Failed to fetch cards');
    }

    return response.json();
  }

  async getById(id: string): Promise<any> {
    const response = await fetch(`${this.apiUrl}/cards/${id}`);

    if (!response.ok) {
      throw new Error('Failed to fetch card');
    }

    return response.json();
  }
}
