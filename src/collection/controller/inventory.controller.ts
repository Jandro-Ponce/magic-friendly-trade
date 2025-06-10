import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, Request, ParseUUIDPipe } from '@nestjs/common';
import { InventoryService } from '../service/inventory.service';
import { CreateInventoryItemDto } from '../dto/create-inventory-item.dto';
import { UpdateInventoryItemDto } from '../dto/update-inventory-item.dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get()
  findAll(@Request() req) {
    return this.inventoryService.findByUser(req.user.userId);
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
    });
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
