import { Test, TestingModule } from '@nestjs/testing';
import { WishlistService } from './wishlist.service';
import { WishlistItemRepository } from '../repository/wishlist-item.repository';

describe('WishlistService', () => {
  let service: WishlistService;
  let repo: jest.Mocked<WishlistItemRepository>;

  beforeEach(async () => {
    const repoMock: jest.Mocked<WishlistItemRepository> = {
      findByUser: jest.fn(),
      findById: jest.fn(),
      createAndSave: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WishlistService,
        { provide: WishlistItemRepository, useValue: repoMock },
      ],
    }).compile();

    service = module.get<WishlistService>(WishlistService);
    repo = module.get(WishlistItemRepository);
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
