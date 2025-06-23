import { Test, TestingModule } from '@nestjs/testing';
import { CardService } from './card.service';

describe('CardService', () => {
  let service: CardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CardService],
    }).compile();

    service = module.get<CardService>(CardService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should fetch cards from scryfall', async () => {
    const data = {
      data: [
        { id: 1, set_name: 'A', lang: 'en' },
        { id: 2, set_name: 'A', lang: 'es' },
        { id: 3, set_name: 'B', lang: 'en' },
      ],
    };
    const fetchMock = jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(data),
    } as any);

    const result = await service.search('test');

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.scryfall.com/cards/search?q=test&include_multilingual=true',
    );
    expect(result.data).toEqual([
      { id: 1, set_name: 'A', lang: 'en' },
      { id: 3, set_name: 'B', lang: 'en' },
    ]);
  });

  it('should fetch card and its prints', async () => {
    const card = { prints_search_uri: 'http://example.com/cards/search?q=a' };
    const prints = {
      data: [
        { id: 1, set_name: 'A', lang: 'en' },
        { id: 2, set_name: 'A', lang: 'es' },
      ],
    };
    const fetchMock = jest
      .spyOn(global, 'fetch')
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(card),
      } as any)
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(prints),
      } as any);

    const result = await service.getById('123');

    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      'https://api.scryfall.com/cards/123',
    );
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      'http://example.com/cards/search?q=a&include_multilingual=true',
    );
    expect(result).toEqual({
      ...card,
      editions: [{ id: 1, set_name: 'A', lang: 'en' }],
    });
  });
});
