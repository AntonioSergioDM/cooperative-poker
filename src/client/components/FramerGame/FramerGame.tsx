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
import { sortCards } from '@/shared/Card';
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
    // On portrait phones spread the seats vertically a touch more and lift the
    // centre so the top players sit higher, leaving a clear middle band for the
    // community-card island (otherwise the island covers their name labels).
    // Landscape/desktop have the headroom to spread out more.
    const radiusY = isPortrait ? 37 : 38;
    const centerY = isPortrait ? 39 : 40;

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
      {/* Wood rail around the viewport edge. Use longhand border properties:
          the `border` shorthand (especially with responsive breakpoints) resets
          border-color to currentColor (white) and wipes border-image, which is
          what made this rail render white. */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          borderStyle: 'solid',
          borderWidth: { xs: '9px', sm: '18px' },
          // Solid wood tone as the guaranteed base, with a plank-like gradient
          // layered on top where border-image is supported.
          borderColor: '#6d4c41',
          borderImage: 'repeating-linear-gradient(45deg, #5d4037 0px, #8d6e63 5px, #6d4c41 10px, #a1887f 15px, #5d4037 20px) 1',
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
        // Group the hand by suit and rank so it always reads consistently.
        const cards = sortCards(isMe ? playerState.hand : gameState.hands[player.originalIndex]);

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
          island and would hide the tap-to-steal chips. On portrait phones it is
          dropped into the empty middle band between the raised top players and
          the current player's hand, and its cards are shrunk so it fits. */}
      <div
        className="absolute left-1/2"
        style={{
          top: isPortrait ? '39%' : '22%',
          transform: isPortrait
            ? 'translate(-50%, -50%)'
            : 'translate(-50%, -20%)',
        }}
      >
        <Table
          gameState={gameState}
          onStealChip={onStealChip}
          cardWidth={isPortrait ? Math.round(smallCard * 0.78) : smallCard}
          chipSize={isPortrait ? Math.round(chipSize * 0.85) : chipSize}
          scale={scale}
        />
      </div>
    </div>
  );
};

export default FramerGame;
