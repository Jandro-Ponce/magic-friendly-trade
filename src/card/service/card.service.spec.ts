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
    const data = { data: [] };
    const fetchMock = jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(data),
    } as any);

    const result = await service.search('test');

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.scryfall.com/cards/search?q=test',
    );
    expect(result).toEqual(data);
  });
});
