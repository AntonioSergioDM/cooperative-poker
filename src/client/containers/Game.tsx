import {
  useMemo,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';

import { type GameState, type PlayerState } from '@/shared/GameTypes';
import type { LobbyPlayerState, LobbyState, ServerToClientEvents } from '@/shared/SocketTypes';

import type { Chip } from '@/shared/Chip';
import { useSocket } from '../tools/useSocket';
import LobbyRoom from '../components/LobbyRoom';
import FramerGame from '../components/FramerGame';

const Game = () => {
  const { enqueueSnackbar } = useSnackbar();

  const socket = useSocket();
  const { query } = useRouter();

  const [players, setPlayers] = useState<LobbyPlayerState[]>([]);
  const [results, setResults] = useState<LobbyState['results']>({
    score: [0, 0], round: 'inProgress', table: [], players: [],
  });
  const [options, setOptions] = useState<LobbyState['options']>([]);

  const [gameState, setGameState] = useState<GameState | null>(null);
  const [playerState, setPlayerState] = useState<PlayerState | null>(null);

  const lobbyHash = useMemo(() => {
    if (!query?.lobby) return '';

    if (typeof query?.lobby === 'string') return query.lobby;

    return '';
  }, [query.lobby]);

  const updatePlayers = useCallback<ServerToClientEvents['playersListUpdated']>((lobbyState) => {
    const { players: newPlayers, results: newResults, options: newOptions } = lobbyState;
    setPlayers(newPlayers);
    setResults(newResults);
    setOptions(newOptions);
  }, []);

  const onGameChange = useCallback<ServerToClientEvents['gameChange']>((newGameState) => {
    setGameState(newGameState);
  }, []);

  useEffect(() => {
    if (lobbyHash) {
      // get current players in lobby
      socket.emit('lobbyPlayers', lobbyHash, (validHash, newPlayers) => {
        if (validHash) {
          setPlayers(newPlayers);
        }
      });
    }
  }, [socket, setPlayers, lobbyHash]);

  const onGameReset = useCallback<ServerToClientEvents['gameReset']>(() => {
    setGameState(null);
    setPlayerState(null);
  }, []);

  const onGameStart = useCallback<ServerToClientEvents['gameStart']>((newPlayerState) => {
    setPlayerState(newPlayerState);
  }, []);

  const onStealChip = useCallback((chip: Chip) => {
    socket.emit('stealChip', chip, (res) => {
      if (typeof res.error === 'string') {
        enqueueSnackbar({
          variant: 'error',
          message: res.error,
        });
      } else {
        setPlayerState(res.data);
      }
    });
  }, [enqueueSnackbar, socket]);

  useEffect(() => {
    const cleanup = () => {
      socket.off('playersListUpdated', updatePlayers);
      socket.off('gameStart', onGameStart);
      socket.off('gameChange', onGameChange);
      socket.off('gameReset', onGameReset);

      socket.emit('leaveLobby');
    };

    socket.on('playersListUpdated', updatePlayers);
    socket.on('gameStart', onGameStart);
    socket.on('gameChange', onGameChange);
    socket.on('gameReset', onGameReset);

    // cleanup when browser/tab closes
    window.addEventListener('beforeunload', cleanup);

    return () => {
      cleanup();
      window.removeEventListener('beforeunload', cleanup);
    };
  }, [onGameChange, onGameReset, onGameStart, socket, updatePlayers]);

  return (
    <>
      {(results.round !== 'inProgress' || !playerState) && <LobbyRoom players={players} lobbyHash={lobbyHash} results={results} options={options} />}

      {(results.round === 'inProgress' && !!playerState && !!gameState) && (
        <FramerGame
          players={players}
          gameState={gameState}
          onStealChip={onStealChip}
          playerState={playerState}
        />
      )}
    </>
  );
};

export default Game;
