import { motion } from 'framer-motion';
import {
  Box,
  Paper,
  Stack,
  Typography,
} from '@mui/material';

import type { LobbyPlayerState } from '@/shared/SocketTypes';
import type { Card } from '@/shared/Card';

import PlayerHand from '@/client/components/Players/PlayerHand';
import React from 'react';

type PlayerSeatProps = {
  player: LobbyPlayerState & {
    originalIndex: number;
    style: React.CSSProperties;
    rotation: number;
  };
  cards: (Card | null)[];
  cardWidth: number;
  isCurrentPlayer: boolean;
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
    handDescription,
    numFigures,
    handValue,
    chips,
  } = props;

  return (
    <div
      className="fixed flex flex-col justify-start items-center gap-3 transform -translate-x-1/2 -translate-y-1/2 hover:z-10"
      style={player.style}
    >

      {/* Cards - rotated to face center */}
      <motion.div
        className="origin-center relative w-24 h-24"
        style={{
          transform: `rotate(${player.rotation}deg)`,
        }}
      >
        <PlayerHand
          cardWidth={cardWidth}
          cards={cards}
          name={player.name}
          isPlayer={isCurrentPlayer}
        />
      </motion.div>

      <Stack gap={1} direction={isCurrentPlayer ? 'row-reverse' : 'column'} justifyContent="center" alignItems="center">
        {/* Player info */}
        <Paper
          className={`border rounded border-solid border-poker-highlight ${(!isCurrentPlayer ? 'border-opacity-30' : ' shadow-[0_0_12px_4px] shadow-poker-highlight')}`}
          sx={{
            p: 1.5,
            backdropFilter: 'blur(8px)',
            transition: 'all 0.3s ease',
          }}
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
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
              </Typography>

              {/* Hand description for current player */}
              {isCurrentPlayer && handDescription && (
                <Typography
                  variant="body1"
                  fontWeight="bold"
                  sx={{
                    color: 'white',
                    textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
                  }}
                >
                  {`Current: ${handDescription}`}
                </Typography>
              )}

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

        {/* Chips */}
        {chips && (
          <Stack
            direction="row"
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
          </Stack>
        )}
      </Stack>

    </div>
  );
};

export default PlayerSeat;
