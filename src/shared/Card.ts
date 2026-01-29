export enum Suit {
  Diamonds = 1,
  Spades = 2,
  Hearts = 3,
  Clubs = 4,
}

export const cardName = (card: Card) => {
  switch (card.value) {
    case 13:
      return 'Ace';
    case 12:
      return 'King';
    case 11:
      return 'Queen';
    case 10:
      return 'Jack';
    default:
      return (card.value + 1).toString();
  }
};

export type Card = {
  suit: Suit | `${Suit}`;
  value: number;
};
