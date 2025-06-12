import { Module } from '@nestjs/common';
import { CardService } from './service/card.service';
import { CardController } from './controller/card.controller';

@Module({
  controllers: [CardController],
  providers: [CardService],
  exports: [CardService],
})
export class CardModule {}
