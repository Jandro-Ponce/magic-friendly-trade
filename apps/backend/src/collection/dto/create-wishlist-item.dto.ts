export class CreateWishlistItemDto {
  cardId: string;
  desiredQuantity: number;
  cardName: string;
  imageUrl?: string;
  language: string;
  addToWishlist: boolean;
}
