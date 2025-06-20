import { Controller, Get, Param, Query } from '@nestjs/common';
import { CardService } from '../service/card.service';

@Controller('cards')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @Get('search')
  search(@Query('q') query: string) {
    return this.cardService.search(query);
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.cardService.getById(id);
  }
}
