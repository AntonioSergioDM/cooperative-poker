import {
  useMemo,
} from 'react';

import {
  type GameState, getOptionDescription,
  type PlayerState,
} from '@/shared/GameTypes';
import type { LobbyPlayerState } from '@/shared/SocketTypes';

import { BIG_CARD, SMALL_CARD } from '@/client/components/AnimatedCard';

import { Typography, Box, useMediaQuery } from '@mui/material';
import type { Chip } from '@/shared/Chip';
import TableChip from '@/client/components/FramerGame/TableChip';
import { getRank, getRankName, getRankValue } from '@/shared/poker';
import { useCardScale } from '@/client/tools/useCardScale';
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

  const scale = useCardScale();
  const bigCard = useMemo(() => Math.round(BIG_CARD * scale), [scale]);
  const smallCard = useMemo(() => Math.round(SMALL_CARD * scale), [scale]);
  const chipSize = useMemo(() => Math.round(48 * scale), [scale]);

  // Portrait phones are tall & narrow: pull the seats in horizontally so wide
  // player labels near the left/right edges don't clip off-screen.
  const isPortrait = useMediaQuery('(max-aspect-ratio: 1/1)');

  // Memorize player positions to prevent recalculation on every render unless players change
  const playerPositions = useMemo(() => {
    const activePlayers = players.filter((p) => p.ready);
    const totalPlayers = activePlayers.length;
    // Radius as percentage of viewport.
    // X is wider on landscape to create an ellipse; tighter on portrait so
    // edge seats keep their labels on-screen.
    const radiusX = isPortrait ? 32 : 42;
    // On portrait phones keep the vertical radius small and push the centre
    // down so the top-center seat clears the top toolbar instead of clipping
    // off-screen. Landscape/desktop have the headroom to spread out more.
    const radiusY = isPortrait ? 33 : 38;
    const centerY = isPortrait ? 46 : 40;

    return activePlayers.map((player, idx) => {
      // Calculate index relative to current player.
      // We want current player (offset 0) to be at 90 degrees (Math.PI / 2) which is the bottom of the circle.
      // We subtract the step to distribute players clockwise (or add for counter-clockwise).
      const offset = idx - playerState.index;
      const angleStep = (2 * Math.PI) / totalPlayers;
      const theta = (Math.PI / 2) + (offset * angleStep);

      // Convert Polar to Cartesian (percentage based)
      // Center is 50, 50.
      const x = 50 + radiusX * Math.cos(theta);
      const y = centerY + radiusY * Math.sin(theta);

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
  }, [players, playerState.index, isPortrait]);

  const pokerHand = useMemo(() => {
    const calculatedRank = getRank([...playerState.hand, ...gameState.table].filter((c) => !!c));
    return `${getRankName(calculatedRank)} of ${getRankValue(calculatedRank)}`;
  }, [playerState.hand, gameState.table]);

  return (
    <div className="relative w-screen h-[100dvh] poker-table-felt overflow-hidden overscroll-none touch-none select-none">
      {/* Wood rail around the table */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          border: { xs: '12px solid', sm: '24px solid' },
          borderImage: 'linear-gradient(135deg, #3e2723 0%, #5d4037 25%, #4e342e 50%, #5d4037 75%, #3e2723 100%) 1',
          pointerEvents: 'none',
          boxShadow: 'inset 0 0 40px rgba(0, 0, 0, 0.5)',
        }}
      />

      {/* Options display with better styling */}
      {!!gameState.options.length && (
        <Box
          sx={{
            position: 'absolute',
            top: { xs: 56, sm: 16 },
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10,
            maxWidth: '92vw',
            background: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(8px)',
            borderRadius: 3,
            px: { xs: 1.5, sm: 3 },
            py: { xs: 0.75, sm: 1.5 },
            border: '1px solid rgba(255, 215, 0, 0.3)',
          }}
        >
          <Typography
            className="text-poker-highlight"
            sx={{
              fontWeight: 600,
              fontSize: { xs: '0.72rem', sm: '0.9rem' },
              letterSpacing: '0.5px',
              textAlign: 'center',
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
            cardWidth={isMe ? bigCard : smallCard}
            scale={scale}
            isCurrentPlayer={isMe}
            handDescription={isMe ? pokerHand : undefined}
            numFigures={gameState.numFigures?.[player.originalIndex]}
            handValue={gameState.handValue?.[player.originalIndex]}
            hasPlayed={gameState.tableChips.length === 0 || gameState.chips[player.originalIndex].some((chip) => chip.color === gameState.tableChips[0].color)}
            chips={gameState.chips[player.originalIndex].length > 0 && (
              <>
                {gameState.chips[player.originalIndex].map((chip) => (
                  <TableChip
                    key={`${chip.color}-${chip.value}`}
                    chip={chip}
                    size={chipSize}
                    onClick={onStealChip}
                  />
                ))}
              </>
            )}
          />
        );
      })}

      {/* Table (community-card island) is centered absolutely. On wide/short
          (non-portrait) screens it is anchored higher so the current player's
          large hand at the bottom clears it — otherwise the hand overlaps the
          island and would hide the tap-to-steal chips. Portrait phones already
          have plenty of vertical gap, so the island stays centred there. */}
      <div
        className="absolute left-1/2 transform -translate-x-1/2 -translate-y-[20%]"
        style={{ top: isPortrait ? '33.333%' : '22%' }}
      >
        <Table
          gameState={gameState}
          onStealChip={onStealChip}
          cardWidth={smallCard}
          chipSize={chipSize}
          scale={scale}
        />
      </div>
    </div>
  );
};

export default FramerGame;
