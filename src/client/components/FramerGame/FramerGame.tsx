import {
  useEffect,
  useCallback,
} from 'react';

import { useSnackbar } from 'notistack';

import {
  type GameState,
  type PlayerState,
} from '@/shared/GameTypes';
import type { LobbyPlayerState, ServerToClientEvents } from '@/shared/SocketTypes';

import { useSocket } from '@/client/tools/useSocket';

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

  const socket = useSocket();
  const { enqueueSnackbar } = useSnackbar();

  const onGameResults = useCallback<ServerToClientEvents['gameResults']>((results) => {
    if (!results.length) {
      return;
    }

    const myTeam = playerState.index % 2;
    const result = results[results.length - 1] || [0, 0];
    enqueueSnackbar({
      variant: 'info',
      message: `Game ended: You ${result[myTeam] > result[myTeam ? 0 : 1] ? 'won' : 'lost'}! Points: ${result[myTeam]}`,
    });
  }, [enqueueSnackbar, playerState.index]);

  useEffect(() => {
    socket.on('gameResults', onGameResults);

    return () => {
      socket.off('gameResults', onGameResults);
    };
  }, [onGameResults, socket]);

  return (
    <div className="relative w-screen h-screen bg-red-950 p-2">
      <Table
        gameState={gameState}
        onStealChip={onStealChip}
      />

      {players.map((player, idx) => {
        const angle = (playerState.index - idx) * ((2 * Math.PI) / players.length) - (3 * (Math.PI / 6));

        const bottom = ((Math.sin(angle) * 100) / 2.3) + 40;
        const left = ((Math.cos(angle) * 100) / 2.3) + 45;

        const position = {
          bottom: `${bottom.toFixed(2)}%`,
          left: `${left.toFixed(2)}%`,
        };

        const rotate = {
          '--tw-rotate': `${angle * (180 / Math.PI) + 90}deg`,
          transform: 'translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) '
            + 'skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))',
          width: '120px',
          height: '120px',
        };

        const cards = playerState.index === idx ? playerState.hand : gameState.hands[idx];
        return (
          <div className="fixed flex flex-col justify-center gap-4" style={position} key={player.name}>
            <div style={rotate}>
              <PlayerHand
                cardWidth={playerState.index === idx ? BIG_CARD : SMALL_CARD}
                cards={cards}
                name={player.name}
              />
            </div>

            <div className="flex flex-row gap-4">
              {gameState.chips[idx].map((chip) => (
                // eslint-disable-next-line react/jsx-key
                <TableChip chip={chip} onClick={onStealChip} />
              ))}
            </div>

            <Typography>{player.name}</Typography>
          </div>
        );
      })}
    </div>
  );
};

export default FramerGame;
