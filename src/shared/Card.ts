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

export const isFigure = (card: Card) => [12, 11, 10].includes(card.value);

export const getPokerCode = (card: Card): string => {
  let value = '';
  switch (card.value) {
    case 13:
      value = 'A';
      break;
    case 12:
      value = 'K';
      break;
    case 11:
      value = 'Q';
      break;
    case 10:
      value = 'J';
      break;
    case 9:
      value = 'T';
      break;
    default:
      value = (card.value + 1).toString();
      break;
  }

  const suit = {
    [Suit.Diamonds]: 'd',
    [Suit.Spades]: 's',
    [Suit.Hearts]: 'h',
    [Suit.Clubs]: 'c',
  }[card.suit];

  // @ts-ignore
  return value + suit;
};

export const filterPoker = (hand: Array<Card | null>) => (
  hand.filter((a) => !!a)
    .map(getPokerCode)
);

export type Card = {
  suit: Suit | `${Suit}`;
  value: number;
};
