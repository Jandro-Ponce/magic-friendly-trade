import { Injectable } from '@nestjs/common';

@Injectable()
export class CardService {
  private readonly apiUrl = 'https://api.scryfall.com';

  async search(query: string, lang = 'en'): Promise<any> {
    const url = new URL(`${this.apiUrl}/cards/search`);
    const searchQuery = lang && lang !== 'en' ? `${lang}:${query}` : query;
    url.searchParams.set('q', searchQuery);
    if (lang) {
      url.searchParams.set('lang', lang);
    }

    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error('Failed to fetch cards');
    }

    return response.json();
  }
}
