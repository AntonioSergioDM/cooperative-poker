import type { Card, Suit } from '@/shared/Card';

export type CalculatedRank = [PokerRank, ...number[]];

export enum PokerRank {
  HighCard,
  Pair,
  TwoPair,
  ThreeOfAKind,
  Straight,
  Flush,
  FullHouse,
  FourOfAKind,
  StraightFlush,
  RoyalFlush,
}

const numForStraight = 5;
export const getRank = (cards: Card[]): CalculatedRank => {
  cards.sort((a, b) => b.value - a.value);

  const auxStraight = {
    numStraight: 1,
    lastValue: cards[0].value,
  };

  const countValues = new Map();

  // For performance only do one foreach
  cards.forEach((c) => {
    // Check Straight
    if (auxStraight.numStraight !== numForStraight) {
      if (c.value === auxStraight.lastValue - 1) {
        auxStraight.numStraight++;
        auxStraight.lastValue = c.value;
      } else if (c.value !== auxStraight.lastValue) {
        auxStraight.numStraight = 1;
        auxStraight.lastValue = c.value;
      }
    }

    // Count occurrences
    countValues.set(c.value, (countValues.get(c.value) || 0) + 1);
  });

  // Ace can be the lowest card in a straight
  if (auxStraight.lastValue === 0 && cards[0].value === 13) {
    auxStraight.numStraight++;
    auxStraight.lastValue = 13;
  }

  if (auxStraight.numStraight === numForStraight) {
    const acceptableCards = cards.filter((c: Card) => {
      // Ace can be the lowest card in a straight
      if (auxStraight.lastValue === 13) {
        return c.value === 13 || c.value <= numForStraight - 1;
      }

      return c.value >= auxStraight.lastValue && c.value <= auxStraight.lastValue + numForStraight;
    });

    const countColors4Straight = new Map();
    acceptableCards.forEach((c: Card) => {
      countColors4Straight.set(c.suit, (countColors4Straight.get(c.suit) || 0) + 1);
    });

    if (countColors4Straight.values().some((v) => v === numForStraight)) {
      if (auxStraight.lastValue === (13 - numForStraight + 1)) {
        return [PokerRank.RoyalFlush, 1];
      }

      return [PokerRank.StraightFlush, auxStraight.lastValue === 13 ? -1 : auxStraight.lastValue];
    }
  }

  const fourOfKindEntry = Array.from(countValues.entries()).find((entry) => entry[1] >= 4);
  if (fourOfKindEntry) {
    const highCard = cards.find((c) => c.value !== fourOfKindEntry[0]);
    return [PokerRank.FourOfAKind, fourOfKindEntry[0], highCard?.value || 0];
  }

  const trioEntry = Array.from(countValues.entries()).find((entry) => entry[1] >= 3);
  if (trioEntry) {
    const pairEntry = Array.from(countValues.entries()).find((entry) => trioEntry[0] !== entry[0] && entry[1] >= 2);

    if (pairEntry) {
      return [PokerRank.FullHouse, trioEntry[0], pairEntry[0]];
    }
  }

  const countColors = new Map();
  let flushSuit: Suit | `${Suit}` | undefined;
  cards.forEach((c: Card) => {
    const current = countColors.get(c.suit) || 0;
    countColors.set(c.suit, current + 1);
    if (current === numForStraight - 1) {
      flushSuit = c.suit;
    }
  });

  if (flushSuit !== undefined) {
    return [PokerRank.Flush, ...cards.filter((c) => c.suit === flushSuit).slice(0, 5).map((c) => c.value)];
  }

  if (auxStraight.numStraight === numForStraight) {
    return [PokerRank.Straight, auxStraight.lastValue === 13 ? -1 : auxStraight.lastValue];
  }

  if (trioEntry) {
    return [PokerRank.ThreeOfAKind, ...cards.filter((c) => c.value !== trioEntry[0]).slice(0, 2).map((c) => c.value)];
  }

  const pairsValue = Array.from(countValues.entries()).filter((entry) => entry[1] >= 2)?.map((entry) => entry[0]);

  if (pairsValue?.length >= 2) {
    return [PokerRank.TwoPair, pairsValue[0], pairsValue[1], cards.filter((c) => ![pairsValue[0], pairsValue[1]].includes(c.value)).map((c) => c.value)[0]];
  }

  if (pairsValue?.length === 1) {
    return [PokerRank.Pair, pairsValue[0], ...cards.filter((c) => c.value !== pairsValue[0]).slice(0, 3).map((c) => c.value)];
  }

  return [PokerRank.HighCard, ...cards.slice(0, 5).map((c) => c.value)];
};

/**
 * @param a
 * @param b
 * @returns number - A negative number if **a** beats **b**, a positive number if **a** loses to **b** and 0 if it's a tie
 */
export const compareRank = (a: CalculatedRank, b: CalculatedRank) => {
  let i = 0;
  while (i < Math.min(a.length, b.length)) {
    if (a[i] !== b[i]) {
      return b[i] - a[i];
    }
    i++;
  }

  return 0;
};

export const getRankName = (rank: PokerRank | CalculatedRank): string => {
  if (Array.isArray(rank)) {
    rank = rank[0];
  }

  switch (rank) {
    case PokerRank.RoyalFlush:
      return 'Royal Flush';
    case PokerRank.StraightFlush:
      return 'Straight Flush';
    case PokerRank.FourOfAKind:
      return 'Four of a Kind';
    case PokerRank.FullHouse:
      return 'Full House';
    case PokerRank.Flush:
      return 'Flush';
    case PokerRank.Straight:
      return 'Straight';
    case PokerRank.ThreeOfAKind:
      return 'Three of a Kind';
    case PokerRank.TwoPair:
      return 'Two Pair';
    case PokerRank.Pair:
      return 'Pair';
    case PokerRank.HighCard:
    default:
      return 'High Card';
  }
};
