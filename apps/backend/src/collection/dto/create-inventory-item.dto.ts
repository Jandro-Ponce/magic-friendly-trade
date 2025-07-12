export class CreateInventoryItemDto {
  cardId: string;
  quantity: number;
  cardName: string;
  imageUrl?: string;
  foil?: boolean;
  signed?: boolean;
  comment?: string;
}
