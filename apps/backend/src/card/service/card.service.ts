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

    const result = await response.json();

    if (Array.isArray(result?.data)) {
      const unique: Record<string, any> = {};
      result.data.forEach((card: any) => {
        if (card.lang === 'en' && !unique[card.set_name]) {
          unique[card.set_name] = card;
        }
      });
      result.data = Object.values(unique);
    }

    return result;
  }

  async getById(id: string): Promise<any> {
    const response = await fetch(`${this.apiUrl}/cards/${id}`);

    if (!response.ok) {
      throw new Error('Failed to fetch card');
    }

    const card = await response.json();

    let printsUrl: string = card.prints_search_uri;

    if (printsUrl && !printsUrl.includes('include_multilingual=')) {
      printsUrl += (printsUrl.includes('?') ? '&' : '?') +
        'include_multilingual=true';
    }

    if (printsUrl) {
      const printsResponse = await fetch(printsUrl);

      if (!printsResponse.ok) {
        throw new Error('Failed to fetch card prints');
      }

      const prints = await printsResponse.json();

      if (Array.isArray(prints?.data)) {
        const unique: Record<string, any> = {};
        prints.data.forEach((ed: any) => {
          if (ed.lang === 'en' && !unique[ed.set_name]) {
            unique[ed.set_name] = ed;
          }
        });
        card.editions = Object.values(unique);
      } else {
        card.editions = prints.data;
      }
    }

    return card;
  }
}
