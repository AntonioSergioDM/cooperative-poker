import {
  useMemo,
  useEffect,
  useCallback,
} from 'react';

import { useSnackbar } from 'notistack';

import {
  getNextPlayer,
  type GameState,
  type PlayerState,
  getPreviousPlayer,
} from '@/shared/GameTypes';
import { type Card } from '@/shared/Card';
import type { LobbyPlayerState, ServerToClientEvents } from '@/shared/SocketTypes';

import { useSocket } from '@/client/tools/useSocket';

import PlayerHand from '@/client/components/Players/PlayerHand';
import { BIG_CARD, SMALL_CARD } from '@/client/components/AnimatedCard';

import Table from './Table';
import {Typography} from "@mui/material";

type FramerGameProps = {
  gameState: GameState;
  players: LobbyPlayerState[];
  playerState: PlayerState;
  onPlayCard: (card: Card) => void;
};

const FramerGame = (props: FramerGameProps) => {
  const {
    gameState,
    players,
    playerState,
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

  const {
    topIdx,
    rightIdx,
    bottomIdx,
    leftIdx,
  } = useMemo(() => ({
    topIdx: getNextPlayer(getNextPlayer(playerState.index)),
    rightIdx: getNextPlayer(playerState.index),
    bottomIdx: playerState.index,
    leftIdx: getPreviousPlayer(playerState.index),
  }), [playerState.index]);

  return (
    <div className="relative w-screen h-screen bg-red-950 p-2">
      <Table
        topIdx={topIdx}
        leftIdx={leftIdx}
        rightIdx={rightIdx}
        gameState={gameState}
        bottomIdx={bottomIdx}
      />

      {players.map((player, idx) => {
        const angle = (bottomIdx - idx) * ((2 * Math.PI) / players.length) - (3 * (Math.PI / 6));

        const bottom = ((Math.sin(angle) * 100) / 2.3) + 45;
        const left = ((Math.cos(angle) * 100) / 2.3) + 45;

        const style = {
          bottom: `${bottom.toFixed(2)}%`,
          left: `${left.toFixed(2)}%`,
          '--tw-rotate': `${angle * (180 / Math.PI) + 90}deg`,
          transform: 'translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) '
            + 'skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))',
        };

        const cards = bottomIdx === idx ? playerState.hand : Array(gameState.hands[idx]).fill(0);
        // TODO make the name appear
        return (
          // TODO check what this is
          // eslint-disable-next-line react/jsx-key
          <div className="fixed flex row justify-center gap-20" style={style}>
            <PlayerHand
              cardWidth={bottomIdx === idx ? BIG_CARD : SMALL_CARD}
              cards={cards}
              name={player.name}
            />

            <Typography>{player.name}</Typography>
          </div>
        );
      })}
    </div>
  );
};

export default FramerGame;
