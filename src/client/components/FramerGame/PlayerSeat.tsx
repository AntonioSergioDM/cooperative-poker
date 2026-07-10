import { motion } from 'framer-motion';
import {
  IconButton,
  Box,
  Paper,
  Stack,
  Typography,
} from '@mui/material';

import type { LobbyPlayerState } from '@/shared/SocketTypes';
import type { Card } from '@/shared/Card';

import PlayerHand from '@/client/components/Players/PlayerHand';
import React from 'react';
import { NotificationsActive } from '@mui/icons-material';
import { useSocket } from '@/client/tools/useSocket';
import { MessageType } from '@/shared/Message';

type PlayerSeatProps = {
  player: LobbyPlayerState & {
    originalIndex: number;
    style: React.CSSProperties;
    rotation: number;
  };
  cards: (Card | null)[];
  cardWidth: number;
  isCurrentPlayer: boolean;
  hasPlayed: boolean;
  scale: number;
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
    hasPlayed,
    scale,
    handDescription,
    numFigures,
    handValue,
    chips,
  } = props;

  const wrapperSize = Math.round(96 * scale);

  const socket = useSocket();
  const remindPlayer = () => socket.emit('message', { type: MessageType.reminder, to: player.id, msg: 'Can you please play?' });

  return (
    <div
      // Only the current player's seat is lifted above the community-card
      // island so their own hand is never hidden behind it. Other seats keep
      // the default stacking so the island can cover them (and the tableChips,
      // which have their own z-10, always stay clickable on top).
      className={`fixed flex flex-col justify-start items-center transform -translate-x-1/2 -translate-y-1/2 ${isCurrentPlayer ? 'z-[5]' : 'hover:z-10'}`}
      style={{ ...player.style, gap: `${Math.round(12 * scale)}px` }}
    >

      {/* Cards - rotated to face center */}
      <motion.div
        className="origin-center relative"
        style={{
          width: wrapperSize,
          height: wrapperSize,
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
            p: `${Math.max(4, Math.round(12 * scale))}px`,
            backdropFilter: 'blur(8px)',
            transition: 'all 0.3s ease',
          }}
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box>
              <div className="flex flex-row gap-1 items-center">
                <Typography
                  variant="body1"
                  fontWeight={isCurrentPlayer ? 'bold' : 'semibold'}
                  sx={{
                    maxWidth: Math.round(140 * scale),
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    color: isCurrentPlayer ? '#ffd700' : 'white',
                    fontSize: `${(isCurrentPlayer ? 1 : 0.9) * scale}rem`,
                    lineHeight: 1.3,
                  }}
                >
                  {player.name}
                </Typography>
                {!isCurrentPlayer && !hasPlayed && (
                  <IconButton className="text-poker-highlight" size="small" onClick={remindPlayer}>
                    <NotificationsActive fontSize="small" />
                  </IconButton>
                )}
              </div>

              {/* Hand description for current player */}
              {isCurrentPlayer && handDescription && (
                <Typography
                  variant="body1"
                  fontWeight="bold"
                  sx={{
                    color: 'white',
                    fontSize: `${0.95 * scale}rem`,
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
                    fontSize: `${0.75 * scale}rem`,
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
