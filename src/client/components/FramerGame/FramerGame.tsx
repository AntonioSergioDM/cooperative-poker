import {
  useEffect,
  useCallback,
  useMemo,
} from 'react';

import { useSnackbar } from 'notistack';

import {
  type GameState,
  type PlayerState,
} from '@/shared/GameTypes';
import type { LobbyPlayerState } from '@/shared/SocketTypes';


import PlayerHand from '@/client/components/Players/PlayerHand';
import { BIG_CARD, SMALL_CARD } from '@/client/components/AnimatedCard';

import { Typography } from '@mui/material';
import type { Chip } from '@/shared/Chip';
import TableChip from '@/client/components/FramerGame/TableChip';
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
      const y = 50 + radiusY * Math.sin(theta);

      return {
        ...player,
        originalIndex: idx,
        style: {
          top: `${y}%`,
          left: `${x}%`,
          position: 'absolute' as const,
        },
        // Calculate rotation for the card container if you want them to face the center
        // Adding 90deg (PI/2) because 0deg is usually pointing Right in CSS rotation
        rotation: theta * (180 / Math.PI) - 90, // +180 to make cards face inward
      };
    });
  }, [players, playerState.index]);

  return (
    <div className="relative w-screen h-screen bg-red-950 overflow-hidden">
      {playerPositions.map((player) => {
        const isMe = playerState.index === player.originalIndex;
        const cards = isMe ? playerState.hand : gameState.hands[player.originalIndex];

        return (
          <div
            key={player.name}
            className="fixed flex flex-col justify-center items-center gap-4 transform -translate-x-1/2 -translate-y-1/2"
            style={player.style}
          >
            {/* Rotate the hand wrapper so cards face the center (optional) */}
            <div className="origin-center w-24 h-24" style={{ transform: `rotate(${player.rotation}deg)` }}>
              <PlayerHand
                cardWidth={isMe ? BIG_CARD : SMALL_CARD}
                cards={cards}
                name={player.name}
              />
            </div>

            <div className="flex flex-row gap-1 z-10">
              {gameState.chips[player.originalIndex].map((chip) => (
                <TableChip
                  key={`${chip.color}-${chip.value}`} // Added unique key
                  chip={chip}
                  onClick={onStealChip}
                />
              ))}
            </div>

            <Typography>
              {player.name}
            </Typography>
          </div>
        );
      })}

      {/* Table is centered absolutely */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <Table
          gameState={gameState}
          onStealChip={onStealChip}
        />
      </div>
    </div>
  );
};

export default FramerGame;
