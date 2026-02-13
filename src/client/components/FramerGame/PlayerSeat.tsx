import { motion } from 'framer-motion';
import {
  Avatar,
  Badge,
  Box,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { Person as PersonIcon } from '@mui/icons-material';

import type { LobbyPlayerState } from '@/shared/SocketTypes';
import type { Card } from '@/shared/Card';

import PlayerHand from '@/client/components/Players/PlayerHand';

type PlayerSeatProps = {
  player: LobbyPlayerState & {
    originalIndex: number;
    style: React.CSSProperties;
    rotation: number;
  };
  cards: (Card | null)[];
  cardWidth: number;
  isCurrentPlayer: boolean;
  isActivePlayer?: boolean;
  handDescription?: string;
  numFigures?: number;
  handValue?: number;
  chips?: React.ReactNode;
};

/**
 * Enhanced player seat component with:
 * - Avatar display
 * - Active player highlighting
 * - Status indicators
 * - Card count display
 * - Cooperative indicators
 */
const PlayerSeat = (props: PlayerSeatProps) => {
  const {
    player,
    cards,
    cardWidth,
    isCurrentPlayer,
    isActivePlayer = false,
    handDescription,
    numFigures,
    handValue,
    chips,
  } = props;

  const cardCount = cards.filter((c) => c !== null).length;

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3, type: 'spring' }}
      className="fixed flex flex-col justify-center items-center gap-2 transform -translate-x-1/2 -translate-y-1/2"
      style={player.style}
    >
      {/* Player info card with avatar */}
      <Paper
        elevation={isActivePlayer ? 8 : 3}
        sx={{
          p: 1,
          bgcolor: isActivePlayer ? 'primary.main' : 'background.paper',
          borderRadius: 2,
          border: isCurrentPlayer ? '2px solid' : 'none',
          borderColor: isCurrentPlayer ? 'secondary.main' : 'transparent',
          transition: 'all 0.3s ease',
          transform: isActivePlayer ? 'scale(1.05)' : 'scale(1)',
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <Badge
            badgeContent={cardCount}
            color="primary"
            max={99}
            overlap="circular"
          >
            <Avatar
              sx={{
                width: isCurrentPlayer ? 48 : 40,
                height: isCurrentPlayer ? 48 : 40,
                bgcolor: isCurrentPlayer ? 'secondary.main' : 'primary.dark',
                transition: 'all 0.3s ease',
              }}
            >
              <PersonIcon />
            </Avatar>
          </Badge>

          <Box>
            <Typography
              variant="body2"
              fontWeight={isCurrentPlayer ? 'bold' : 'normal'}
              sx={{
                maxWidth: 120,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {player.name}
              {isCurrentPlayer && ' (You)'}
            </Typography>

            {(numFigures !== undefined || handValue !== undefined) && (
              <Typography variant="caption" color="text.secondary">
                {numFigures !== undefined && `${numFigures} figures`}
                {numFigures !== undefined && handValue !== undefined && ' • '}
                {handValue !== undefined && `${handValue} pts`}
              </Typography>
            )}
          </Box>
        </Stack>
      </Paper>

      {/* Cards - rotated to face center */}
      <div
        className="origin-center relative"
        style={{
          transform: `rotate(${player.rotation}deg)`,
          width: cardWidth * 3,
          height: cardWidth * 1.5,
        }}
      >
        <PlayerHand
          cardWidth={cardWidth}
          cards={cards}
          name={player.name}
          isPlayer={isCurrentPlayer}
        />
      </div>

      {/* Hand description for current player */}
      {isCurrentPlayer && handDescription && (
        <Paper
          elevation={2}
          sx={{
            px: 2,
            py: 0.5,
            bgcolor: 'rgba(93, 15, 128, 0.8)',
            borderRadius: 2,
          }}
        >
          <Typography variant="body2" fontWeight="medium">
            {handDescription}
          </Typography>
        </Paper>
      )}

      {/* Chips */}
      {chips && (
        <Box display="flex" flexDirection="row" gap={0.5} zIndex={10}>
          {chips}
        </Box>
      )}

      {/* Active player indicator */}
      {isActivePlayer && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-4 -right-4 w-3 h-3 bg-yellow-400 rounded-full shadow-lg"
          style={{
            boxShadow: '0 0 10px rgba(250, 204, 21, 0.8)',
          }}
        />
      )}
    </motion.div>
  );
};

export default PlayerSeat;
