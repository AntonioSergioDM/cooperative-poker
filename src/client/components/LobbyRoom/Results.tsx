import type { LobbyPlayerState, LobbyState } from '@/shared/SocketTypes';
import {
  Stack, Typography, Box, Paper,
} from '@mui/material';
import { motion } from 'framer-motion';
import TableCard from '@/client/components/FramerGame/TableCard';
import TableChip from '@/client/components/FramerGame/TableChip';
import ResultCounter from '@/client/components/LobbyRoom/ResultCounter';
import ResultMessage from '@/client/components/LobbyRoom/ResultMessage';
import type { ColorNames } from '@/client/tools/colors';

type ResultsProps = {
  results: LobbyState['results'];
  players: LobbyPlayerState[];
};

const Results = ({ results, players }: ResultsProps) => {
  if (results.players.length > players.length) {
    return null;
  }

  if (!results.round || results.round === 'inProgress') {
    return null;
  }

  const animDelay = 2;
  const animInitial = { opacity: 0, y: 20 };
  const animAnimation = { opacity: 1, y: 0 };

  results.players.sort((playerB, playerA) => {
    if (results.round === 'win') {
      return ((playerA.chip?.value || 0) - (playerB.chip?.value || 0));
    }

    return (
      (playerB.rank?.value || 0) - (playerA.rank?.value || 0))
      || ((playerA.rank?.handRank || 0) - (playerB.rank?.handRank || 0))
      || ((playerA.chip?.value || 0) - (playerB.chip?.value || 0)
      );
  });

  const playerOrder = results.players.map((player) => ({
    chip: player.chip,
    name: players[player.index].name,
    hand: player.hand,
    rank: player.rank,
  }));

  let resultColor: ColorNames = 'green';
  if (results.round === 'win') {
    resultColor = 'green';
  } else if (results.round === 'lose') {
    resultColor = 'red';
  }

  return (
    <Box
      sx={{
        background: 'linear-gradient(135deg, rgba(26, 77, 46, 0.3) 0%, rgba(15, 40, 24, 0.3) 100%)',
        backdropFilter: 'blur(12px)',
        border: '2px solid rgba(255, 215, 0, 0.2)',
        borderRadius: 4,
        p: 3,
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
      }}
    >
      <Stack direction="column" spacing={3}>
        {/* Score Display */}
        <motion.div
          initial={animInitial}
          animate={animAnimation}
          transition={{ delay: playerOrder.length * animDelay, duration: 0.4 }}
        >
          <Stack direction="row" spacing={5} justifyContent="center" alignItems="center">
            <ResultCounter content={results.score[0]} label="lost" color="red" emoji="💀" />

            <ResultMessage
              color={resultColor}
              message={results.score.reduce((a, b) => a + b) ? `You ${results.round}!` : 'Ready when you are'}
            />

            <ResultCounter content={results.score[1]} label="win" color="green" emoji="🏆" />
          </Stack>
        </motion.div>

        {/* Community Cards */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: 2,
            p: 2,
            background: 'rgba(0, 0, 0, 0.3)',
            borderRadius: 3,
            border: '1px solid rgba(255, 215, 0, 0.2)',
          }}
        >
          {results.table.map((card) => (
            <TableCard card={card} key={`${card.value} - ${card.suit}`} />
          ))}
        </Box>

        {/* Player Results */}
        <Stack
          direction="row"
          spacing={2}
          flexWrap="wrap"
          justifyContent="center"
          sx={{ gap: 2 }}
        >
          {playerOrder.map((player, idx) => (
            <motion.div
              key={`${player.name}-${player.chip?.value}`}
              initial={animInitial}
              animate={animAnimation}
              transition={{ delay: idx * animDelay, duration: 0.4 }}
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
                  border: idx + 1 !== player.chip?.value
                    ? '3px solid rgba(239, 68, 68, 0.6)'
                    : '3px solid rgba(34, 197, 94, 0.6)',
                  borderRadius: 3,
                  boxShadow: idx + 1 !== player.chip?.value
                    ? '0 8px 24px rgba(239, 68, 68, 0.3)'
                    : '0 8px 12px rgba(34, 197, 94, 0.3)',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: idx + 1 !== player.chip?.value
                      ? '0 12px 32px rgba(239, 68, 68, 0.4)'
                      : '0 12px 20px rgba(34, 197, 94, 0.4)',
                  },
                }}
              >
                {/* Rank Badge */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #9333ea 0%, #7c3aed 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    color: 'white',
                    boxShadow: '0 2px 8px rgba(147, 51, 234, 0.5)',
                    border: '2px solid rgba(255, 255, 255, 0.2)',
                  }}
                >
                  {idx + 1}
                </Box>

                {/* Player Cards */}
                <Stack direction="row" spacing={-3} sx={{ mt: 2, mb: 1 }}>
                  {player.hand.map((card) => (
                    <TableCard card={card} key={card.value} />
                  ))}
                </Stack>

                {/* Hand Rank */}
                {player.rank?.handName && (
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
                    {player.rank.handName}
                  </Typography>
                )}

                {/* Chips */}
                <Stack direction="row" gap={-1.5} alignItems="center" sx={{ my: 1 }}>
                  <TableChip chip={player.chip!} onClick={() => {}} />
                </Stack>

                {/* Player Name */}
                <Typography
                  variant="body1"
                  fontWeight="semibold"
                  textAlign="center"
                  sx={{
                    maxWidth: 160,
                    color: 'white',
                    mt: 1,
                  }}
                >
                  {player.name}
                </Typography>
              </Paper>
            </motion.div>
          ))}
        </Stack>
      </Stack>
    </Box>
  );
};

export default Results;
