import { Test, TestingModule } from '@nestjs/testing';
import { InventoryService } from './inventory.service';
import { InventoryItemRepository } from '../repository/inventory-item.repository';
import { CardService } from './card.service';

describe('InventoryService', () => {
  let service: InventoryService;
  let repo: jest.Mocked<InventoryItemRepository>;
  let card: jest.Mocked<CardService>;

  beforeEach(async () => {
    const repoMock: jest.Mocked<InventoryItemRepository> = {
      findByUser: jest.fn(),
      findById: jest.fn(),
      createAndSave: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    } as any;

    const cardMock: jest.Mocked<CardService> = {
      findById: jest.fn(),
      create: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InventoryService,
        { provide: InventoryItemRepository, useValue: repoMock },
        { provide: CardService, useValue: cardMock },
      ],
    }).compile();

    service = module.get<InventoryService>(InventoryService);
    repo = module.get(InventoryItemRepository);
    card = module.get(CardService);
  });

  it('should create an item', async () => {
    const item: any = { id: '1' };
    repo.createAndSave.mockResolvedValue(item);
    card.findById.mockResolvedValue(null);
    const result = await service.create({ card: { id: 'card1' } } as any);
    expect(result).toBe(item);
    expect(repo.createAndSave).toHaveBeenCalled();
    expect(card.findById).toHaveBeenCalledWith('card1');
    expect(card.create).toHaveBeenCalled();
  });

  it('should update an item', async () => {
    const item: any = { id: '1' };
    repo.findById.mockResolvedValue({ id: '1', user: { id: 'user1' } } as any);
    repo.update.mockResolvedValue(item);
    const result = await service.update('user1', '1', {});
    expect(result).toBe(item);
    expect(repo.findById).toHaveBeenCalledWith('1');
    expect(repo.update).toHaveBeenCalledWith('1', {});
  });

  it('should remove an item', async () => {
    repo.findById.mockResolvedValue({ id: '1', user: { id: 'user1' } } as any);
    repo.remove.mockResolvedValue(undefined);
    await service.remove('user1', '1');
    expect(repo.findById).toHaveBeenCalledWith('1');
    expect(repo.remove).toHaveBeenCalledWith('1');
  });
});
