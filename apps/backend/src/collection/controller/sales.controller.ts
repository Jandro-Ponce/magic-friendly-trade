import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Request,
  ParseUUIDPipe,
} from '@nestjs/common';
import { InventoryService } from '../service/inventory.service';
import { WishlistService } from '../service/wishlist.service';
import { CreateInventoryItemDto } from '../dto/create-inventory-item.dto';
import { UpdateInventoryItemDto } from '../dto/update-inventory-item.dto';
import { FindSellersDto } from '../dto/find-sellers.dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('sales')
export class SalesController {
  constructor(
    private readonly inventoryService: InventoryService,
    private readonly wishlistService: WishlistService,
  ) {}

  @Get()
  findAll(@Request() req) {
    return this.inventoryService.findByUser(req.user.userId);
  }

  // Últimas 5 cartas puestas a la venta
  @Get('latest-listed')
  async getLatestListed() {
    return this.inventoryService.findLatestListed(5);
  }

  // Últimas 5 cartas vendidas
  @Get('latest-sold')
  async getLatestSold() {
    return this.inventoryService.findLatestSold(5);
  }

  @Post()
  create(@Request() req, @Body() dto: CreateInventoryItemDto) {
    const userId = req.user.userId;
    return this.inventoryService.create({
      user: { id: userId } as any,
      card: {
        id: dto.cardId,
        name: dto.cardName,
        imageUrl: dto.imageUrl,
      } as any,
      quantity: dto.quantity,
      foil: Boolean(dto.foil),
      signed: Boolean(dto.signed),
      comment: dto.comment,
    });
  }

  @Post('find-sellers')
  async findSellers(@Request() req, @Body() dto: FindSellersDto) {
    if (dto.addToWishlist) {
      await this.wishlistService.create({
        user: { id: req.user.userId } as any,
        card: {
          id: dto.cardId,
          name: dto.cardName,
          imageUrl: dto.imageUrl,
        } as any,
        imageUrl: dto.imageUrl,
        desiredQuantity: dto.quantity ?? 1,
        language: dto.language ?? 'indiferente',
      });
    }
    return this.inventoryService.findByCard(dto.cardId);
  }

  @Get('card/:id')
  findByCard(@Param('id') id: string) {
    return this.inventoryService.findByCard(id);
  }

  @Put(':id')
  update(
    @Request() req,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateInventoryItemDto,
  ) {
    return this.inventoryService.update(req.user.userId, id, dto);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id', new ParseUUIDPipe()) id: string) {
    return this.inventoryService.remove(req.user.userId, id);
  }
}
