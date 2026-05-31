import {
  compareRank,
  getRank,
  PokerRank,
} from '../poker';
import type { Card } from '../Card';
import { cardToShortString, Suit } from '../Card';

describe('Poker Hand Ranking Tests', () => {
  const tests: [PokerRank, Card[]][] = [
    [PokerRank.RoyalFlush, [{
      suit: Suit.Clubs,
      value: 10,
    }, {
      suit: Suit.Clubs,
      value: 11,
    }, {
      suit: Suit.Clubs,
      value: 12,
    }, {
      suit: Suit.Clubs,
      value: 13,
    }, {
      suit: Suit.Clubs,
      value: 9,
    }]],
    [PokerRank.StraightFlush, [{
      suit: Suit.Diamonds,
      value: 9,
    }, {
      suit: Suit.Diamonds,
      value: 8,
    }, {
      suit: Suit.Diamonds,
      value: 7,
    }, {
      suit: Suit.Diamonds,
      value: 6,
    }, {
      suit: Suit.Diamonds,
      value: 10,
    }]],
    [PokerRank.FourOfAKind, [{
      suit: Suit.Diamonds,
      value: 9,
    }, {
      suit: Suit.Hearts,
      value: 9,
    }, {
      suit: Suit.Spades,
      value: 9,
    }, {
      suit: Suit.Clubs,
      value: 9,
    }, {
      suit: Suit.Diamonds,
      value: 10,
    }]],
    [PokerRank.FullHouse, [{
      suit: Suit.Diamonds,
      value: 9,
    }, {
      suit: Suit.Hearts,
      value: 9,
    }, {
      suit: Suit.Spades,
      value: 9,
    }, {
      suit: Suit.Clubs,
      value: 10,
    }, {
      suit: Suit.Diamonds,
      value: 10,
    }]],
    [PokerRank.Flush, [{
      suit: Suit.Clubs,
      value: 3,
    }, {
      suit: Suit.Clubs,
      value: 5,
    }, {
      suit: Suit.Clubs,
      value: 12,
    }, {
      suit: Suit.Clubs,
      value: 13,
    }, {
      suit: Suit.Clubs,
      value: 9,
    }]],
    [PokerRank.Straight, [{
      suit: Suit.Diamonds,
      value: 10,
    }, {
      suit: Suit.Clubs,
      value: 11,
    }, {
      suit: Suit.Hearts,
      value: 12,
    }, {
      suit: Suit.Clubs,
      value: 13,
    }, {
      suit: Suit.Clubs,
      value: 9,
    }]],
    [PokerRank.Straight, [{
      suit: Suit.Diamonds,
      value: 1,
    }, {
      suit: Suit.Clubs,
      value: 2,
    }, {
      suit: Suit.Hearts,
      value: 3,
    }, {
      suit: Suit.Clubs,
      value: 5,
    }, {
      suit: Suit.Clubs,
      value: 4,
    }]],
    [PokerRank.Straight, [{
      suit: Suit.Diamonds,
      value: 1,
    }, {
      suit: Suit.Clubs,
      value: 2,
    }, {
      suit: Suit.Hearts,
      value: 3,
    }, {
      suit: Suit.Clubs,
      value: 13,
    }, {
      suit: Suit.Clubs,
      value: 4,
    }]],
    [PokerRank.ThreeOfAKind, [{
      suit: Suit.Diamonds,
      value: 9,
    }, {
      suit: Suit.Hearts,
      value: 9,
    }, {
      suit: Suit.Spades,
      value: 9,
    }, {
      suit: Suit.Clubs,
      value: 8,
    }, {
      suit: Suit.Diamonds,
      value: 10,
    }]],
    [PokerRank.TwoPair, [{
      suit: Suit.Diamonds,
      value: 9,
    }, {
      suit: Suit.Hearts,
      value: 9,
    }, {
      suit: Suit.Spades,
      value: 3,
    }, {
      suit: Suit.Clubs,
      value: 3,
    }, {
      suit: Suit.Diamonds,
      value: 10,
    }]],
    [PokerRank.Pair, [{
      suit: Suit.Diamonds,
      value: 9,
    }, {
      suit: Suit.Hearts,
      value: 9,
    }, {
      suit: Suit.Spades,
      value: 3,
    }, {
      suit: Suit.Clubs,
      value: 5,
    }, {
      suit: Suit.Diamonds,
      value: 10,
    }]],
    [PokerRank.HighCard, [{
      suit: Suit.Diamonds,
      value: 11,
    }, {
      suit: Suit.Hearts,
      value: 9,
    }, {
      suit: Suit.Spades,
      value: 3,
    }, {
      suit: Suit.Clubs,
      value: 5,
    }, {
      suit: Suit.Diamonds,
      value: 10,
    }]],
  ];

  tests.forEach((test, index) => {
    const [expectedRank, cards] = test;
    it(`test case ${index}: ${cards.map(cardToShortString)
      .join(', ')} - ${PokerRank[expectedRank]}`, () => {
      const result = getRank(cards);
      expect(result[0])
        .toBe(expectedRank);
      expect(result[0])
        .toBeGreaterThanOrEqual(PokerRank.HighCard);
      expect(result[0])
        .toBeLessThanOrEqual(PokerRank.RoyalFlush);
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
        {
          suit: Suit.Diamonds,
          value: 13,
        }, // Ace of Diamonds
        {
          suit: Suit.Clubs,
          value: 13,
        }, // Ace of Clubs
        {
          suit: Suit.Clubs,
          value: 9,
        }, // 10 of Clubs
        {
          suit: Suit.Hearts,
          value: 9,
        }, // 10 of Hearts
        {
          suit: Suit.Spades,
          value: 5,
        }, // 6 of Spades
      ],
      [
        [{
          suit: Suit.Spades,
          value: 13,
        }, {
          suit: Suit.Spades,
          value: 10,
        }], // Ace of Spades & Jack of Spades
        [{
          suit: Suit.Clubs,
          value: 3,
        }, {
          suit: Suit.Clubs,
          value: 7,
        }], // 4 of Clubs & 8 of Clubs
        [{
          suit: Suit.Hearts,
          value: 2,
        }, {
          suit: Suit.Spades,
          value: 2,
        }], // 3 of Hearts & 3 of Spades
      ],
    ],

    // Test 1
    [
      // Table cards
      [
        {
          suit: Suit.Hearts,
          value: 9,
        }, // 10 of Hearts
        {
          suit: Suit.Diamonds,
          value: 3,
        }, // 4 of Diamonds
        {
          suit: Suit.Diamonds,
          value: 9,
        }, // 10 of Diamonds
        {
          suit: Suit.Hearts,
          value: 8,
        }, // 9 of Hearts
        {
          suit: Suit.Hearts,
          value: 12,
        }, // King of Hearts
      ],
      [
        [{
          suit: Suit.Hearts,
          value: 1,
        }, {
          suit: Suit.Clubs,
          value: 8,
        }], // 2 of Heats & 9 of Clubs
        [{
          suit: Suit.Spades,
          value: 8,
        }, {
          suit: Suit.Spades,
          value: 10,
        }], // 9 of Spades & Jack of Spades
        [{
          suit: Suit.Clubs,
          value: 10,
        }, {
          suit: Suit.Hearts,
          value: 6,
        }], // Jack of Clubs & 7 of Hearts
        [{
          suit: Suit.Spades,
          value: 1,
        }, {
          suit: Suit.Hearts,
          value: 5,
        }], // 2 of Spades & 6 of Hearts
      ],
    ],
  ];

  tests.forEach((test, testIndex) => {
    const [tableCards, playerCards] = test;
    describe(`Table ${testIndex}: ${tableCards.map(cardToShortString)
      .join(', ')}`, () => {
      const calculated = playerCards.map((playerHand, playerIndex) => {
        it(`should calculate a rank for ${playerHand.map(cardToShortString)
          .join(', ')}`, () => {
          const result = getRank([...playerHand, ...tableCards]);
          expect(result)
            .toBeDefined();
          expect(result.length)
            .toBeGreaterThan(0);
          expect(result[0])
            .toBeGreaterThanOrEqual(PokerRank.HighCard);
          expect(result[0])
            .toBeLessThanOrEqual(PokerRank.RoyalFlush);
        });
        const result = getRank([...playerHand, ...tableCards]);
        return {
          id: playerIndex,
          calculated: result,
        };
      });

      it('should sort the players correctly', () => {
        calculated.sort((a, b) => compareRank(a.calculated, b.calculated));
        playerCards.forEach((playerHand, playerIndex) => {
          expect(calculated[playerIndex].id)
            .toBe(playerIndex);
        });
      });
    });
  });
});

function shuffle(array: Array<any>) {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

describe('shuffle()', () => {
  // Test 1: Integrity of the data
  test('should contain the exact same elements after shuffling', () => {
    const input = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const output = shuffle(input);

    // Sort both to ensure they have the same elements
    expect([...output].sort((a, b) => a - b))
      .toEqual(input);
    // Ensure it didn't mutate the original array
    expect(input)
      .toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });

  // Test 2: Basic randomness check
  test('should change the order of elements', () => {
    const input = Array.from({ length: 100 }, (_, i) => i);
    const output = shuffle(input);

    // It is statistically astronomically rare for a 100-element array
    // to shuffle back into perfect original order.
    expect(output)
      .not
      .toEqual(input);
  });

  // Test 3: Handling edge cases
  test('should handle empty arrays and single-element arrays', () => {
    expect(shuffle([]))
      .toEqual([]);
    expect(shuffle([42]))
      .toEqual([42]);
  });

  // Test 4: Statistical Uniformity (The ultimate test for randomness)
  test('should have a uniform distribution over many shuffles', () => {
    const input = [1, 2, 3];
    const counts = {
      '1,2,3': 0,
      '1,3,2': 0,
      '2,1,3': 0,
      '2,3,1': 0,
      '3,1,2': 0,
      '3,2,1': 0,
    };

    const iterations = 60000; // 6 possible permutations, ~10k expected each

    for (let i = 0; i < iterations; i++) {
      const result: number[] = shuffle(input);
      // @ts-ignore
      counts[result.join(',')]++;
    }

    // Every permutation should appear roughly 10,000 times.
    // We allow a reasonable margin of error (e.g., +/- 10%) for statistical variance.
    const expectedAverage = iterations / 6;
    const lowerBound = expectedAverage * 0.9; // 9,000
    const upperBound = expectedAverage * 1.1; // 11,000

    Object.values(counts)
      .forEach((count) => {
        expect(count)
          .toBeGreaterThan(lowerBound);
        expect(count)
          .toBeLessThan(upperBound);
      });
  });
});

const createDeck = () => {
  const fullDeck: { suit: Suit; rank: number }[] = [];
  [Suit.Diamonds, Suit.Spades, Suit.Hearts, Suit.Clubs].forEach((suit) => {
    let i: number = 13;
    while (i) {
      fullDeck.push({
        suit,
        rank: i,
      });

      i--;
    }
  });
  return fullDeck;
};

describe('Shuffle Algorithm - 52 Card Deck Verification', () => {
  // Test 1: Content Integrity
  test('should retain all 52 unique cards after shuffling', () => {
    const deck = createDeck();
    const shuffledDeck = shuffle(deck);

    // 1. Check total length
    expect(shuffledDeck.length).toBe(52);

    // 2. Check for uniqueness (no duplicates introduced)
    const uniqueCards = new Set(shuffledDeck.map((c) => `${c.rank} of ${c.suit}`));
    expect(uniqueCards.size).toBe(52);

    // 3. Ensure all original cards are still present
    deck.forEach((originalCard) => {
      const match = shuffledDeck.find((c) => c.suit === originalCard.suit && c.rank === originalCard.rank);
      expect(match).toBeDefined();
    });
  });

  // Test 2: Randomness Verification
  test('should significantly alter the order of the deck', () => {
    const deck = createDeck();
    const shuffledDeck = shuffle(deck);

    // Ensure it's not in the exact same order
    expect(shuffledDeck).not.toEqual(deck);

    // Count how many cards remained in their exact original index
    let identicalPositions = 0;
    for (let i = 0; i < deck.length; i++) {
      if (deck[i].suit === shuffledDeck[i].suit && deck[i].rank === shuffledDeck[i].rank) {
        identicalPositions++;
      }
    }

    // In a truly random 52-card shuffle, the average number of cards
    // remaining in their original spot is 1. It's statistically rare to exceed 5.
    expect(identicalPositions).toBeLessThan(6);
  });

  // Test 3: Statistical Uniformity (The Position Distribution Test)
  test('should distribute the Ace of Spades uniformly across all 52 positions', () => {
    const iterations = 52000; // 52 positions, so ~1,000 times per position expected
    const positionCounts = new Array(52).fill(0);

    for (let i = 0; i < iterations; i++) {
      const deck = createDeck();
      const shuffled = shuffle(deck);

      // Find where the Ace of Spades ended up
      const aceIndex = shuffled.findIndex((c) => c.suit === 'Spades' && c.rank === 'A');
      positionCounts[aceIndex]++;
    }

    // Ideal average is 1000 times per slot.
    // We allow a reasonable margin of error (+/- 15%) for natural statistical variance.
    const expectedAverage = iterations / 52; // 1000
    const lowerBound = expectedAverage * 0.85; // 850
    const upperBound = expectedAverage * 1.15; // 1150

    positionCounts.forEach((count, index) => {
      try {
        expect(count).toBeGreaterThan(lowerBound);
        expect(count).toBeLessThan(upperBound);
      } catch (error) {
        // Formats a nice error message if a slot fails randomness checks
        throw new Error(`Slot ${index} failed uniformity. Expected ~1000, got ${count}`);
      }
    });
  });
});
