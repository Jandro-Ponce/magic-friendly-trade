import { Test, TestingModule } from '@nestjs/testing';
import { InventoryService } from './inventory.service';
import { InventoryItemRepository } from '../repository/inventory-item.repository';

describe('InventoryService', () => {
  let service: InventoryService;
  let repo: jest.Mocked<InventoryItemRepository>;

  beforeEach(async () => {
    const repoMock: jest.Mocked<InventoryItemRepository> = {
      findByUser: jest.fn(),
      findById: jest.fn(),
      createAndSave: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InventoryService,
        { provide: InventoryItemRepository, useValue: repoMock },
      ],
    }).compile();

    service = module.get<InventoryService>(InventoryService);
    repo = module.get(InventoryItemRepository);
  });

  it('should create an item', async () => {
    const item: any = { id: '1' };
    repo.createAndSave.mockResolvedValue(item);
    const result = await service.create({});
    expect(result).toBe(item);
    expect(repo.createAndSave).toHaveBeenCalled();
  });

  it('should update an item', async () => {
    const item: any = { id: '1' };
    repo.update.mockResolvedValue(item);
    const result = await service.update('1', {});
    expect(result).toBe(item);
    expect(repo.update).toHaveBeenCalledWith('1', {});
  });

  it('should remove an item', async () => {
    repo.remove.mockResolvedValue(undefined);
    await service.remove('1');
    expect(repo.remove).toHaveBeenCalledWith('1');
  });
});
