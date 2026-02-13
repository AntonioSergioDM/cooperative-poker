import {
  useMemo,
} from 'react';

import {
  type GameState, getOptionDescription,
  type PlayerState,
} from '@/shared/GameTypes';
import type { LobbyPlayerState } from '@/shared/SocketTypes';

import { BIG_CARD, SMALL_CARD } from '@/client/components/AnimatedCard';

import { Typography, Box } from '@mui/material';
import type { Chip } from '@/shared/Chip';
import TableChip from '@/client/components/FramerGame/TableChip';
import { filterPoker } from '@/shared/Card';
import PlayerSeat from './PlayerSeat';
import Table from './Table';

type FramerGameProps = {
  gameState: GameState;
  players: LobbyPlayerState[];
  playerState: PlayerState;
  onStealChip: (chip: Chip) => void;
};

const FramerGame = (props: FramerGameProps) => {
  const {
    gameState,
    players,
    playerState,
    onStealChip,
  } = props;

  // Memoize player positions to prevent recalculation on every render unless players change
  const playerPositions = useMemo(() => {
    const totalPlayers = players.length;
    // Radius as percentage of viewport.
    // X is wider (42vw) to create an ellipse for landscape screens.
    const radiusX = 42;
    const radiusY = 38;

    return players.map((player, idx) => {
      // Calculate index relative to current player.
      // We want current player (offset 0) to be at 90 degrees (Math.PI / 2) which is the bottom of the circle.
      // We subtract the step to distribute players clockwise (or add for counter-clockwise).
      const offset = idx - playerState.index;
      const angleStep = (2 * Math.PI) / totalPlayers;
      const theta = (Math.PI / 2) + (offset * angleStep);

      // Convert Polar to Cartesian (percentage based)
      // Center is 50, 50.
      const x = 50 + radiusX * Math.cos(theta);
      const y = 40 + radiusY * Math.sin(theta);

      return {
        ...player,
        originalIndex: idx,
        style: {
          top: `${y}%`,
          left: playerState.index === idx ? '50%' : `${x}%`,
          position: 'absolute',
        } as const,
        // Calculate rotation for the card container if you want them to face the center
        // Adding 90deg (PI/2) because 0deg is usually pointing Right in CSS rotation
        rotation: theta * (180 / Math.PI) - 90, // +180 to make cards face inward
      };
    });
  }, [players, playerState.index]);

  const pokerHand = useMemo(() => (
    // eslint-disable-next-line @typescript-eslint/no-var-requires,global-require
    require('pokersolver').Hand.solve([...filterPoker(playerState.hand), ...filterPoker(gameState.table)]).descr
  ), [playerState.hand, gameState.table]);

  return (
    <div className="relative w-screen h-screen poker-table-felt overflow-hidden">
      {/* Wood rail around the table */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          border: '24px solid',
          borderImage: 'linear-gradient(135deg, #3e2723 0%, #5d4037 25%, #4e342e 50%, #5d4037 75%, #3e2723 100%) 1',
          pointerEvents: 'none',
          boxShadow: 'inset 0 0 40px rgba(0, 0, 0, 0.5)',
        }}
      />

      {/* Options display with better styling */}
      {gameState.options.length && (
        <Box
          sx={{
            position: 'absolute',
            top: 16,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10,
            background: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(8px)',
            borderRadius: 3,
            px: 3,
            py: 1.5,
            border: '1px solid rgba(255, 215, 0, 0.3)',
          }}
        >
          <Typography
            className="text-poker-highlight"
            sx={{
              fontWeight: 600,
              fontSize: '0.9rem',
              letterSpacing: '0.5px',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
            }}
          >
            {/* @ts-ignore */}
            {[...new Set(gameState.options)].map(getOptionDescription).join(' | ')}
          </Typography>
        </Box>
      )}

      {playerPositions.map((player) => {
        const isMe = playerState.index === player.originalIndex;
        const cards = isMe ? playerState.hand : gameState.hands[player.originalIndex];

        return (
          <PlayerSeat
            key={player.name + player.originalIndex}
            player={player}
            cards={cards}
            cardWidth={isMe ? BIG_CARD : SMALL_CARD}
            isCurrentPlayer={isMe}
            handDescription={isMe ? pokerHand : undefined}
            numFigures={gameState.numFigures?.[player.originalIndex]}
            handValue={gameState.handValue?.[player.originalIndex]}
            chips={gameState.chips[player.originalIndex].length > 0 && (
              <>
                {gameState.chips[player.originalIndex].map((chip) => (
                  <TableChip
                    key={`${chip.color}-${chip.value}`}
                    chip={chip}
                    onClick={onStealChip}
                  />
                ))}
              </>
            )}
          />
        );
      })}

      {/* Table is centered absolutely */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[70%]">
        <Table
          gameState={gameState}
          onStealChip={onStealChip}
        />
      </div>
    </div>
  );
};

export default FramerGame;
