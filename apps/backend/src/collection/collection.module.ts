import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Card } from './entity/card.entity';
import { InventoryItem } from './entity/inventory-item.entity';
import { WishlistItem } from './entity/wishlist-item.entity';
import { CardRepository } from './repository/card.repository';
import { InventoryItemRepository } from './repository/inventory-item.repository';
import { WishlistItemRepository } from './repository/wishlist-item.repository';
import { CardService } from './service/card.service';
import { InventoryService } from './service/inventory.service';
import { WishlistService } from './service/wishlist.service';
import { InventoryController } from './controller/inventory.controller';
import { WishlistController } from './controller/wishlist.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Card, InventoryItem, WishlistItem])],
  controllers: [InventoryController, WishlistController],
  providers: [
    CardRepository,
    InventoryItemRepository,
    WishlistItemRepository,
    CardService,
    InventoryService,
    WishlistService,
  ],
  exports: [CardService, InventoryService, WishlistService],
})
export class CollectionModule {}
