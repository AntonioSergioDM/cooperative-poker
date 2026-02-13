import { useState } from 'react';
import {
  Stack,
  Typography,
  Button,
  Box,
  Paper,
} from '@mui/material';
import { PlayingCard } from '@/client/components/AnimatedCard';
import { Suit } from '@/shared/Card';
import Layout from '@/client/components/Layout';

/**
 * Demo page showcasing the new PlayingCard component with all its features:
 * - Front/Back flip animation
 * - Highlight state
 * - Disabled state
 * - Deal animation
 * - Interactive states
 */
const CardDemo = () => {
  const [isFaceUp, setIsFaceUp] = useState(true);
  const [isHighlighted, setIsHighlighted] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [dealTrigger, setDealTrigger] = useState(0);

  const sampleCard = { suit: Suit.Hearts, value: 12 }; // King of Hearts

  return (
    <Layout>
      <Stack spacing={4} padding={4} maxWidth="1200px" margin="0 auto">
        <Typography variant="h3" textAlign="center">
          🎴 PlayingCard Component Demo
        </Typography>

        <Paper elevation={3} sx={{ p: 4, bgcolor: 'background.paper' }}>
          <Typography variant="h5" gutterBottom>
            Interactive Card
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Use the controls below to test different card states
          </Typography>

          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="300px"
            bgcolor="rgba(93, 15, 128, 0.1)"
            borderRadius={2}
            my={3}
          >
            <PlayingCard
              card={sampleCard}
              width={150}
              isFaceUp={isFaceUp}
              isHighlighted={isHighlighted}
              isDisabled={isDisabled}
              clickable
              dealTrigger={dealTrigger}
              onClick={() => {
                // eslint-disable-next-line no-console
                console.log('Card clicked!');
              }}
            />
          </Box>

          <Stack spacing={2}>
            <Button
              variant="contained"
              onClick={() => setIsFaceUp(!isFaceUp)}
              fullWidth={false}
            >
              {isFaceUp ? 'Flip to Back' : 'Flip to Front'}
            </Button>
            <Button
              variant="outlined"
              onClick={() => setIsHighlighted(!isHighlighted)}
              fullWidth={false}
            >
              {isHighlighted ? 'Remove Highlight' : 'Add Highlight'}
            </Button>
            <Button
              variant="outlined"
              onClick={() => setIsDisabled(!isDisabled)}
              fullWidth={false}
            >
              {isDisabled ? 'Enable Card' : 'Disable Card'}
            </Button>
            <Button
              variant="outlined"
              onClick={() => setDealTrigger((prev) => prev + 1)}
              fullWidth={false}
            >
              Trigger Deal Animation
            </Button>
          </Stack>
        </Paper>

        <Paper elevation={3} sx={{ p: 4, bgcolor: 'background.paper' }}>
          <Typography variant="h5" gutterBottom>
            Card States Gallery
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom mb={3}>
            All possible card states displayed side by side
          </Typography>

          <Stack direction="row" spacing={3} flexWrap="wrap" justifyContent="center">
            <Box textAlign="center">
              <Typography variant="caption" display="block" mb={1}>
                Face Up
              </Typography>
              <PlayingCard
                card={{ suit: Suit.Spades, value: 13 }}
                width={120}
                isFaceUp
              />
            </Box>

            <Box textAlign="center">
              <Typography variant="caption" display="block" mb={1}>
                Face Down
              </Typography>
              <PlayingCard
                card={{ suit: Suit.Diamonds, value: 11 }}
                width={120}
                isFaceUp={false}
              />
            </Box>

            <Box textAlign="center">
              <Typography variant="caption" display="block" mb={1}>
                Highlighted
              </Typography>
              <PlayingCard
                card={{ suit: Suit.Hearts, value: 10 }}
                width={120}
                isFaceUp
                isHighlighted
              />
            </Box>

            <Box textAlign="center">
              <Typography variant="caption" display="block" mb={1}>
                Disabled
              </Typography>
              <PlayingCard
                card={{ suit: Suit.Clubs, value: 9 }}
                width={120}
                isFaceUp
                isDisabled
              />
            </Box>

            <Box textAlign="center">
              <Typography variant="caption" display="block" mb={1}>
                Clickable + Hover
              </Typography>
              <PlayingCard
                card={{ suit: Suit.Diamonds, value: 8 }}
                width={120}
                isFaceUp
                clickable
                onClick={() => {
                  // eslint-disable-next-line no-alert
                  alert('Card clicked!');
                }}
              />
            </Box>

            <Box textAlign="center">
              <Typography variant="caption" display="block" mb={1}>
                With Pulse
              </Typography>
              <PlayingCard
                card={{ suit: Suit.Hearts, value: 7 }}
                width={120}
                isFaceUp
                pulse
              />
            </Box>

            <Box textAlign="center">
              <Typography variant="caption" display="block" mb={1}>
                RGB Pulse
              </Typography>
              <PlayingCard
                card={{ suit: Suit.Spades, value: 6 }}
                width={120}
                isFaceUp
                rgb
                pulse
              />
            </Box>
          </Stack>
        </Paper>

        <Paper elevation={3} sx={{ p: 4, bgcolor: 'background.paper' }}>
          <Typography variant="h5" gutterBottom>
            Features
          </Typography>
          <Stack spacing={1} component="ul" sx={{ pl: 2 }}>
            <Typography component="li">
              ✅ Front/back state works without remount
            </Typography>
            <Typography component="li">
              ✅ Flip animation is smooth and 3D (Y-axis rotation)
            </Typography>
            <Typography component="li">
              ✅ Highlight state visually clear but subtle (yellow glow)
            </Typography>
            <Typography component="li">
              ✅ Disabled state blocks interaction and reduces opacity
            </Typography>
            <Typography component="li">
              ✅ Deal animation smooth and non-janky (scale + translate)
            </Typography>
            <Typography component="li">
              ✅ No layout shift during flip (fixed dimensions)
            </Typography>
            <Typography component="li">
              ✅ GPU-accelerated transforms (translate, scale, rotate)
            </Typography>
            <Typography component="li">
              ✅ Hover and tap effects on clickable cards
            </Typography>
            <Typography component="li">
              ✅ Compatible with existing pulse animations
            </Typography>
          </Stack>
        </Paper>

        <Paper elevation={3} sx={{ p: 4, bgcolor: 'background.paper' }}>
          <Typography variant="h5" gutterBottom>
            Usage Example
          </Typography>
          <Box
            component="pre"
            sx={{
              bgcolor: 'rgba(0,0,0,0.5)',
              p: 2,
              borderRadius: 1,
              overflow: 'auto',
            }}
          >
            <code>
              {`import { PlayingCard } from '@/client/components/AnimatedCard';

<PlayingCard
  card={{ suit: Suit.Hearts, value: 12 }}
  width={100}
  isFaceUp={true}
  isHighlighted={false}
  isDisabled={false}
  clickable={true}
  onClick={() => console.log('Clicked!')}
  dealTrigger={dealCount}
/>`}
            </code>
          </Box>
        </Paper>
      </Stack>
    </Layout>
  );
};

export default CardDemo;
