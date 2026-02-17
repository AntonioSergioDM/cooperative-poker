import { motion } from 'framer-motion';
import {
  Box, Container, Typography, Paper, Stack,
} from '@mui/material';
import { Suit } from '@/shared/Card';
import AnimatedCard, { BIG_CARD, SMALL_CARD } from '@/client/components/AnimatedCard';
import PlayerHand from '@/client/components/Players/PlayerHand';

const cardDemo = [
  { suit: Suit.Hearts, value: 13 },
  { suit: Suit.Diamonds, value: 12 },
  { suit: Suit.Clubs, value: 11 },
  { suit: Suit.Spades, value: 10 },
  { suit: Suit.Hearts, value: 9 },
];

const GameSizingDemo = () => (
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

    <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Typography
          variant="h3"
          sx={{
            mb: 4,
            textAlign: 'center',
            fontWeight: 700,
            color: '#ffd700',
            textShadow: '0 2px 10px rgba(255, 215, 0, 0.5)',
          }}
        >
          🎴 Card Sizing Improvements
        </Typography>

        <Stack spacing={4}>
          {/* Big Cards (Current Player) */}
          <Paper className="casino-box p-6">
            <Typography
              variant="h5"
              sx={{ mb: 3, color: '#ffd700', fontWeight: 600 }}
            >
              Current Player (BIG_CARD: 140px)
            </Typography>
            <Box
              sx={{
                position: 'relative',
                height: '300px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <PlayerHand
                cards={cardDemo}
                cardWidth={BIG_CARD}
                name="Current Player"
                isPlayer
              />
            </Box>
          </Paper>

          {/* Small Cards (Other Players) */}
          <Paper className="casino-box p-6">
            <Typography
              variant="h5"
              sx={{ mb: 3, color: '#ffd700', fontWeight: 600 }}
            >
              Other Players (SMALL_CARD: 100px)
            </Typography>
            <Box
              sx={{
                position: 'relative',
                height: '240px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <PlayerHand
                cards={cardDemo}
                cardWidth={SMALL_CARD}
                name="Other Player"
                isPlayer={false}
              />
            </Box>
          </Paper>

          {/* Comparison */}
          <Paper
            sx={{
              p: 4,
              background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.2) 0%, rgba(124, 58, 237, 0.2) 100%)',
              backdropFilter: 'blur(12px)',
              border: '2px solid rgba(147, 51, 234, 0.3)',
              borderRadius: 4,
            }}
          >
            <Typography
              variant="h5"
              sx={{ mb: 3, color: '#ffd700', fontWeight: 600 }}
            >
              Individual Card Comparison
            </Typography>
            <Stack direction="row" spacing={4} justifyContent="center" alignItems="center">
              <Box textAlign="center">
                <Typography variant="body1" sx={{ mb: 2, color: 'white' }}>
                  Previous Size (80px)
                </Typography>
                <AnimatedCard
                  width={80}
                  card={{ suit: Suit.Hearts, value: 13 }}
                />
              </Box>
              <Box textAlign="center">
                <Typography variant="body1" sx={{ mb: 2, color: '#ffd700', fontWeight: 'bold' }}>
                  New SMALL (100px)
                </Typography>
                <AnimatedCard
                  width={SMALL_CARD}
                  card={{ suit: Suit.Hearts, value: 13 }}
                />
              </Box>
              <Box textAlign="center">
                <Typography variant="body1" sx={{ mb: 2, color: 'white' }}>
                  Previous BIG (100px)
                </Typography>
                <AnimatedCard
                  width={100}
                  card={{ suit: Suit.Hearts, value: 13 }}
                />
              </Box>
              <Box textAlign="center">
                <Typography variant="body1" sx={{ mb: 2, color: '#ffd700', fontWeight: 'bold' }}>
                  New BIG (140px)
                </Typography>
                <AnimatedCard
                  width={BIG_CARD}
                  card={{ suit: Suit.Hearts, value: 13 }}
                />
              </Box>
            </Stack>
          </Paper>

          {/* Improvements List */}
          <Paper
            sx={{
              p: 3,
              background: 'rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 215, 0, 0.2)',
              borderRadius: 3,
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, color: '#ffd700' }}>
              ✨ Improvements Made
            </Typography>
            <Stack spacing={1}>
              <Typography sx={{ color: 'white' }}>
                ✅ SMALL_CARD: 80px → 100px (+25%)
              </Typography>
              <Typography sx={{ color: 'white' }}>
                ✅ BIG_CARD: 100px → 140px (+40%)
              </Typography>
              <Typography sx={{ color: 'white' }}>
                ✅ Card closeness: 25px → 35px (better spread)
              </Typography>
              <Typography sx={{ color: 'white' }}>
                ✅ Max rotation: 65° → 55° (less extreme)
              </Typography>
              <Typography sx={{ color: 'white' }}>
                ✅ Card container: 3x → 3.5x width (no clipping)
              </Typography>
              <Typography sx={{ color: 'white' }}>
                ✅ Container height: 1.5x → 2x (proper spacing)
              </Typography>
            </Stack>
          </Paper>
        </Stack>
      </motion.div>
    </Container>
  </Box>
);

export default GameSizingDemo;
