export enum Suit {
  Diamonds = 1,
  Spades = 2,
  Hearts = 3,
  Clubs = 4,
}

export const cardName = (card: Card) => {
  switch (card.value) {
    case 13:
    case 0: // Sometimes we may need the Ace to be 1 for straight
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
export const cardShortName = (card: Card) => {
  switch (card.value) {
    case 13:
    case 0: // Sometimes we may need the Ace to be 1 for straight
      return 'A';
    case 12:
      return 'K';
    case 11:
      return 'Q';
    case 10:
      return 'J';
    case 9:
      return 'T';
    default:
      return (card.value + 1).toString();
  }
};

export const cardSuit = (card: Card) => Suit[card.suit];
export const cardShortSuit = (card: Card) => {
  switch (card.suit) {
    case Suit.Diamonds:
      return '♦️';
    case Suit.Spades:
      return '♠️';
    case Suit.Hearts:
      return '♥️';
    case Suit.Clubs:
      return '♣️';
    default:
      return '';
  }
};

export const cardToString = (card: Card) => `${cardName(card)} of ${cardSuit(card)}`;
export const cardToShortString = (card: Card) => `${cardShortName(card)}${cardShortSuit(card)}`;

export const stringToCard = (str: string): false | Card => {
  if (str.length > 3 || str.length < 2) {
    return false;
  }

  if (str.length === 3) {
    if (!str.startsWith('10')) {
      return false;
    }

    str.replace('10', 'T');
  }

  // now i have length 2

  const [value, suitString] = str.toUpperCase();
  let suit: Suit;
  switch (suitString) {
    case 'D':
    case '♦️':
      suit = Suit.Diamonds;
      break;
    case 'S':
    case '♠️':
      suit = Suit.Spades;
      break;
    case 'H':
    case '♥️':
      suit = Suit.Hearts;
      break;
    case 'C':
    case '♣️':
      suit = Suit.Clubs;
      break;
    default:
      return false;
  }
  if (!Number.isNaN(Number(value)) && Number(value) > 1) {
    return { suit, value: Number(value) - 1 };
  }

  switch (value) {
    case 'A':
    case '1':
      return { suit, value: 13 };
    case 'K':
      return { suit, value: 12 };
    case 'Q':
      return { suit, value: 11 };
    case 'J':
      return { suit, value: 10 };
    case 'T':
      return { suit, value: 9 };
    default:
      return false;
  }
};

export const isFigure = (card: Card) => [12, 11, 10].includes(card.value);

export type Card = {
  suit: Suit | `${Suit}`;
  value: number;
};
