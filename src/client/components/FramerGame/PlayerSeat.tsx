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
      className="fixed flex flex-col justify-center items-center gap-3 transform -translate-x-1/2 -translate-y-1/2"
      style={player.style}
    >
      {/* Player info card with avatar */}
      <Paper
        elevation={isActivePlayer ? 8 : 3}
        sx={{
          p: 1.5,
          bgcolor: isActivePlayer ? 'primary.main' : 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(8px)',
          borderRadius: 2,
          border: isCurrentPlayer ? '3px solid' : '2px solid rgba(255, 215, 0, 0.3)',
          borderColor: isCurrentPlayer ? '#ffd700' : 'rgba(255, 215, 0, 0.3)',
          transition: 'all 0.3s ease',
          transform: isActivePlayer ? 'scale(1.05)' : 'scale(1)',
          boxShadow: isCurrentPlayer 
            ? '0 4px 20px rgba(255, 215, 0, 0.4)'
            : '0 4px 12px rgba(0, 0, 0, 0.3)',
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Badge
            badgeContent={cardCount}
            color="primary"
            max={99}
            overlap="circular"
            sx={{
              '& .MuiBadge-badge': {
                fontSize: '0.75rem',
                fontWeight: 'bold',
              },
            }}
          >
            <Avatar
              sx={{
                width: isCurrentPlayer ? 56 : 48,
                height: isCurrentPlayer ? 56 : 48,
                bgcolor: isCurrentPlayer ? '#9333ea' : 'primary.dark',
                transition: 'all 0.3s ease',
                border: '2px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <PersonIcon sx={{ fontSize: isCurrentPlayer ? 32 : 28 }} />
            </Avatar>
          </Badge>

          <Box>
            <Typography
              variant="body1"
              fontWeight={isCurrentPlayer ? 'bold' : 'semibold'}
              sx={{
                maxWidth: 140,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                color: isCurrentPlayer ? '#ffd700' : 'white',
                fontSize: isCurrentPlayer ? '1rem' : '0.9rem',
              }}
            >
              {player.name}
              {isCurrentPlayer && ' (You)'}
            </Typography>

            {(numFigures !== undefined || handValue !== undefined) && (
              <Typography 
                variant="caption" 
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: '0.75rem',
                }}
              >
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
          width: cardWidth * 3.5,
          height: cardWidth * 2,
          minHeight: '200px',
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
          elevation={3}
          sx={{
            px: 2.5,
            py: 1,
            background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.9) 0%, rgba(124, 58, 237, 0.9) 100%)',
            backdropFilter: 'blur(8px)',
            borderRadius: 2,
            border: '2px solid rgba(255, 215, 0, 0.3)',
            boxShadow: '0 4px 12px rgba(147, 51, 234, 0.4)',
          }}
        >
          <Typography 
            variant="body1" 
            fontWeight="bold"
            sx={{ 
              color: '#ffd700',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
            }}
          >
            {handDescription}
          </Typography>
        </Paper>
      )}

      {/* Chips */}
      {chips && (
        <Box 
          display="flex" 
          flexDirection="row" 
          gap={1} 
          zIndex={10}
          sx={{
            background: 'rgba(0, 0, 0, 0.5)',
            borderRadius: 2,
            p: 0.5,
            backdropFilter: 'blur(4px)',
          }}
        >
          {chips}
        </Box>
      )}

      {/* Active player indicator */}
      {isActivePlayer && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-4 -right-4 w-4 h-4 bg-yellow-400 rounded-full shadow-lg"
          style={{
            boxShadow: '0 0 15px rgba(250, 204, 21, 0.9)',
          }}
        />
      )}
    </motion.div>
  );
};

export default PlayerSeat;
