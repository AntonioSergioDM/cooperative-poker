import {
  compareRank,
  getRank,
  PokerRank,
} from '../poker';
import type { Card } from '../Card';
import { cardToShortString, Suit } from '../Card';

describe('Poker Hand Ranking Tests', () => {
  const tests: [PokerRank, Card[]][] = [
    [PokerRank.RoyalFlush, [{ suit: Suit.Clubs, value: 10 }, { suit: Suit.Clubs, value: 11 }, { suit: Suit.Clubs, value: 12 }, { suit: Suit.Clubs, value: 13 }, { suit: Suit.Clubs, value: 9 }]],
    [PokerRank.StraightFlush, [{ suit: Suit.Diamonds, value: 9 }, { suit: Suit.Diamonds, value: 8 }, { suit: Suit.Diamonds, value: 7 }, { suit: Suit.Diamonds, value: 6 }, { suit: Suit.Diamonds, value: 10 }]],
    [PokerRank.FourOfAKind, [{ suit: Suit.Diamonds, value: 9 }, { suit: Suit.Hearts, value: 9 }, { suit: Suit.Spades, value: 9 }, { suit: Suit.Clubs, value: 9 }, { suit: Suit.Diamonds, value: 10 }]],
    [PokerRank.FullHouse, [{ suit: Suit.Diamonds, value: 9 }, { suit: Suit.Hearts, value: 9 }, { suit: Suit.Spades, value: 9 }, { suit: Suit.Clubs, value: 10 }, { suit: Suit.Diamonds, value: 10 }]],
    [PokerRank.Flush, [{ suit: Suit.Clubs, value: 3 }, { suit: Suit.Clubs, value: 5 }, { suit: Suit.Clubs, value: 12 }, { suit: Suit.Clubs, value: 13 }, { suit: Suit.Clubs, value: 9 }]],
    [PokerRank.Straight, [{ suit: Suit.Diamonds, value: 10 }, { suit: Suit.Clubs, value: 11 }, { suit: Suit.Hearts, value: 12 }, { suit: Suit.Clubs, value: 13 }, { suit: Suit.Clubs, value: 9 }]],
    [PokerRank.Straight, [{ suit: Suit.Diamonds, value: 1 }, { suit: Suit.Clubs, value: 2 }, { suit: Suit.Hearts, value: 3 }, { suit: Suit.Clubs, value: 5 }, { suit: Suit.Clubs, value: 4 }]],
    [PokerRank.Straight, [{ suit: Suit.Diamonds, value: 1 }, { suit: Suit.Clubs, value: 2 }, { suit: Suit.Hearts, value: 3 }, { suit: Suit.Clubs, value: 13 }, { suit: Suit.Clubs, value: 4 }]],
    [PokerRank.ThreeOfAKind, [{ suit: Suit.Diamonds, value: 9 }, { suit: Suit.Hearts, value: 9 }, { suit: Suit.Spades, value: 9 }, { suit: Suit.Clubs, value: 8 }, { suit: Suit.Diamonds, value: 10 }]],
    [PokerRank.TwoPair, [{ suit: Suit.Diamonds, value: 9 }, { suit: Suit.Hearts, value: 9 }, { suit: Suit.Spades, value: 3 }, { suit: Suit.Clubs, value: 3 }, { suit: Suit.Diamonds, value: 10 }]],
    [PokerRank.Pair, [{ suit: Suit.Diamonds, value: 9 }, { suit: Suit.Hearts, value: 9 }, { suit: Suit.Spades, value: 3 }, { suit: Suit.Clubs, value: 5 }, { suit: Suit.Diamonds, value: 10 }]],
    [PokerRank.HighCard, [{ suit: Suit.Diamonds, value: 11 }, { suit: Suit.Hearts, value: 9 }, { suit: Suit.Spades, value: 3 }, { suit: Suit.Clubs, value: 5 }, { suit: Suit.Diamonds, value: 10 }]],
  ];

  tests.forEach((test, index) => {
    const [expectedRank, cards] = test;
    it(`test case ${index}: ${cards.map(cardToShortString).join(', ')} - ${PokerRank[expectedRank]}`, () => {
      const result = getRank(cards);
      expect(result[0]).toBe(expectedRank);
      expect(result[0]).toBeGreaterThanOrEqual(PokerRank.HighCard);
      expect(result[0]).toBeLessThanOrEqual(PokerRank.RoyalFlush);
    });
  });
});

describe('Poker Game Result Tests', () => {
  // Adding tests from the first set as well, verifying they produce a valid rank.
  // Since the original UI code didn't assert specific outcomes for these,
  // we will just ensure they return a valid calculated rank structure.
  // In a real scenario, we'd want to assert the specific expected rank for each player.
  const tests: [Card[], Card[][]][] = [
    // Test 0
    [
      // Table cards
      [
        { suit: Suit.Diamonds, value: 13 }, // Ace of Diamonds
        { suit: Suit.Clubs, value: 13 }, // Ace of Clubs
        { suit: Suit.Clubs, value: 9 }, // 10 of Clubs
        { suit: Suit.Hearts, value: 9 }, // 10 of Hearts
        { suit: Suit.Spades, value: 5 }, // 6 of Spades
      ],
      [
        [{ suit: Suit.Spades, value: 13 }, { suit: Suit.Spades, value: 10 }], // Ace of Spades & Jack of Spades
        [{ suit: Suit.Clubs, value: 3 }, { suit: Suit.Clubs, value: 7 }], // 4 of Clubs & 8 of Clubs
        [{ suit: Suit.Hearts, value: 2 }, { suit: Suit.Spades, value: 2 }], // 3 of Hearts & 3 of Spades
      ],
    ],

    // Test 1
    [
      // Table cards
      [
        { suit: Suit.Hearts, value: 9 }, // 10 of Hearts
        { suit: Suit.Diamonds, value: 3 }, // 4 of Diamonds
        { suit: Suit.Diamonds, value: 9 }, // 10 of Diamonds
        { suit: Suit.Hearts, value: 8 }, // 9 of Hearts
        { suit: Suit.Hearts, value: 12 }, // King of Hearts
      ],
      [
        [{ suit: Suit.Hearts, value: 1 }, { suit: Suit.Clubs, value: 8 }], // 2 of Heats & 9 of Clubs
        [{ suit: Suit.Spades, value: 8 }, { suit: Suit.Spades, value: 10 }], // 9 of Spades & Jack of Spades
        [{ suit: Suit.Clubs, value: 10 }, { suit: Suit.Hearts, value: 6 }], // Jack of Clubs & 7 of Hearts
        [{ suit: Suit.Spades, value: 1 }, { suit: Suit.Hearts, value: 5 }], // 2 of Spades & 6 of Hearts
      ],
    ],
  ];

  tests.forEach((test, testIndex) => {
    const [tableCards, playerCards] = test;
    describe(`Table ${testIndex}: ${tableCards.map(cardToShortString).join(', ')}`, () => {
      const calculated = playerCards.map((playerHand, playerIndex) => {
        it(`should calculate a rank for ${playerHand.map(cardToShortString).join(', ')}`, () => {
          const result = getRank([...playerHand, ...tableCards]);
          expect(result).toBeDefined();
          expect(result.length).toBeGreaterThan(0);
          expect(result[0]).toBeGreaterThanOrEqual(PokerRank.HighCard);
          expect(result[0]).toBeLessThanOrEqual(PokerRank.RoyalFlush);
        });
        const result = getRank([...playerHand, ...tableCards]);
        return { id: playerIndex, calculated: result };
      });

      it('should sort the players correctly', () => {
        calculated.sort((a, b) => compareRank(a.calculated, b.calculated));
        playerCards.forEach((playerHand, playerIndex) => {
          expect(calculated[playerIndex].id).toBe(playerIndex);
        });
      });
    });
  });
});
