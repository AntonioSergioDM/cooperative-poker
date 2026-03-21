/* eslint-disable react/no-array-index-key */
import {
  Box, Container, Paper, Stack, Typography,
} from '@mui/material';

import type { Card } from '@/shared/Card';
import { Suit } from '@/shared/Card';
import { motion } from 'framer-motion';
import { PokerRank, getRank, getRankName } from '@/shared/poker';
import TableCard from '../components/FramerGame/TableCard';

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
      [{ suit: Suit.Clubs, value: 3 }, { suit: Suit.Clubs, value: 7 }], // 4 of Clubs & 8 of Clubs
      [{ suit: Suit.Hearts, value: 2 }, { suit: Suit.Spades, value: 2 }], // 3 of Hearts & 3 of Spades
      [{ suit: Suit.Spades, value: 13 }, { suit: Suit.Spades, value: 10 }], // Ace of Spades & Jack of Spades
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
      [{ suit: Suit.Spades, value: 8 }, { suit: Suit.Spades, value: 10 }], // 9 of Spades & Jack of Spades
      [{ suit: Suit.Clubs, value: 10 }, { suit: Suit.Hearts, value: 6 }], // Jack of Clubs & 7 of Hearts
      [{ suit: Suit.Hearts, value: 1 }, { suit: Suit.Clubs, value: 8 }], // 2 of Heats & 9 of Clubs
      [{ suit: Suit.Spades, value: 1 }, { suit: Suit.Hearts, value: 5 }], // 2 of Spades & 6 of Hearts
    ],
  ],
];

const tests2: [PokerRank, Card[]][] = [
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
const Tests = () => (
  <Box
    className="casino-lights"
    sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}
  >
    {/* Background decoration */}
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 50% 50%, rgba(147, 51, 234, 0.1) 0%, transparent 50%)',
        animation: 'pulse-glow 4s ease-in-out infinite',
      }}
    />

    <Container className="p-4">
      {tests.map((test, testNumber) => {
        testNumber++;
        const [tableCards, playerCards] = test;

        return (
          <div key={`Test ${testNumber}`} className="flex flex-col gap-4 items-center justify-center">
            <Typography variant="h2">
              {`Test ${testNumber}`}
            </Typography>
            <Box
              key={`Test ${testNumber} - Table cards`}
              sx={{
                background: 'rgba(0, 0, 0, 0.3)',
                borderRadius: 3,
                border: '1px solid rgba(255, 215, 0, 0.2)',
              }}
            >
              <div className="w-full p-4 flex flex-row gap-2 items-center justify-center overflow-x-auto">
                {tableCards.map((card) => (
                  <TableCard card={card} key={`${card.value} - ${card.suit}`} />
                ))}
              </div>
            </Box>

            <div
              id="hands-holder"
              className="py-2 h-96 flex flex-row gap-4 justify-around overflow-visible overflow-x-auto w-full"
            >
              {playerCards.map((player, idx) => (
                <motion.div
                  key={`Test ${testNumber} - Player ${idx}`}
                >
                  <Paper
                    elevation={4}
                    sx={{
                      p: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      minWidth: '180px',
                      minHeight: '240px',
                      background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.2) 0%, rgba(124, 58, 237, 0.2) 100%)',
                      backdropFilter: 'blur(8px)',
                      border: '3px solid rgba(34, 197, 94, 0.6)',
                      borderRadius: 3,
                      boxShadow: '0 8px 12px rgba(34, 197, 94, 0.3)',
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 12px 20px rgba(34, 197, 94, 0.4)',
                      },
                    }}
                  >
                    {/* Player Cards */}
                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{
                        mt: 2,
                        mb: 1,
                      }}
                    >
                      {player.map((card) => (
                        <TableCard card={card} key={card.value} />
                      ))}
                    </Stack>

                    {/* Hand Rank */}
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      sx={{
                        color: '#ffd700',
                        textAlign: 'center',
                        textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
                        mb: 1,
                      }}
                    >
                      {getRank([...player, ...tableCards]).join(', ')}
                    </Typography>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      sx={{
                        color: '#ffd700',
                        textAlign: 'center',
                        textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
                        mb: 1,
                      }}
                    >
                      {getRankName(getRank([...player, ...tableCards]))}
                    </Typography>

                    {/* Player Name */}
                    <div className="h-12 w-full max-w-40 flex items-center justify-center">
                      <Typography
                        variant="body1"
                        fontWeight="semibold"
                        textAlign="center"
                        sx={{
                          color: 'white',
                          mt: 1,
                        }}
                      >
                        {`Player ${idx}`}
                      </Typography>
                    </div>
                  </Paper>
                </motion.div>
              ))}
            </div>
          </div>
        );
      })}

      <Typography className="mx-auto w-fit" variant="h3">
        Other tests
      </Typography>

      {tests2.map((test, testNumber) => {
        const expected = test[0];
        const cards = test[1];

        return (
          <div key={`Test 2 ${testNumber}`} className="flex flex-row gap-4 items-center justify-center">
            <div className="p-4 flex flex-row gap-2 items-center justify-center overflow-x-auto">
              {cards.map((card) => (
                <TableCard card={card} key={`${card.value} - ${card.suit}`} />
              ))}
            </div>
            <div className="w-52">
              {`Expected: ${PokerRank[expected]}`}
              <br />
              {`Result: ${PokerRank[getRank(cards)[0]]}`}
              <br />
              {`Rank: ${getRank(cards).join(', ')}`}
            </div>
          </div>
        );
      })}
    </Container>
  </Box>
);

export default Tests;
