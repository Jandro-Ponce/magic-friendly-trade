import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, Request, ParseUUIDPipe } from '@nestjs/common';
import { WishlistService } from '../service/wishlist.service';
import { CreateWishlistItemDto } from '../dto/create-wishlist-item.dto';
import { UpdateWishlistItemDto } from '../dto/update-wishlist-item.dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Get()
  findAll(@Request() req) {
    return this.wishlistService.findByUser(req.user.userId);
  }

  @Post()
  create(@Request() req, @Body() dto: CreateWishlistItemDto) {
    const userId = req.user.userId;
    return this.wishlistService.create({
      user: { id: userId } as any,
      card: { id: dto.cardId } as any,
      desiredQuantity: dto.desiredQuantity,
    });
  }

  @Put(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateWishlistItemDto,
  ) {
    return this.wishlistService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.wishlistService.remove(id);
  }
}
