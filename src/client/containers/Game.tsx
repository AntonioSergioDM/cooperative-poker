import {
  useMemo,
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';

import { type GameState, type PlayerState } from '@/shared/GameTypes';
import type { LobbyPlayerState, LobbyState, ServerToClientEvents } from '@/shared/SocketTypes';

import type { Chip } from '@/shared/Chip';
import { Box, IconButton } from '@mui/material';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import { useSocket } from '../tools/useSocket';
import LobbyRoom from '../components/LobbyRoom';
import FramerGame from '../components/FramerGame';
import { sound } from '../tools/sounds';

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

  const [isMuted, setIsMuted] = useState(false);
  const isMutedRef = useRef(isMuted);

  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  const handleToggleMuted = () => {
    setIsMuted((prev) => !prev);
  };

  const onGameChange = useCallback<ServerToClientEvents['gameChange']>((newGameState) => {
    setGameState(newGameState);
    // Play the beep sound
    if (!isMutedRef.current) {
      sound('beep');
    }
  }, []);

  const [isHost, setHost] = useState<boolean>(false);

  useEffect(() => {
    if (lobbyHash) {
      // get current players in lobby
      socket.emit('lobbyPlayers', lobbyHash, (validHash, newPlayers, newResults, newOptions) => {
        if (!validHash) {
          return;
        }
        setPlayers(newPlayers);
        if (newPlayers.length === 1) {
          setHost(true);
        }
        if (newResults) {
          setResults(newResults);
        }
        setOptions(newOptions);
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
          autoHideDuration: 2000,
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
      <Box sx={{ position: 'absolute', width: '100%', zIndex: 1 }}>
        {/* The Absolute Positioned Button */}
        <IconButton
          onClick={handleToggleMuted}
          sx={{ position: 'absolute', top: 16, right: 16 }}
        >
          {isMuted ? <VolumeOffIcon /> : <VolumeUpIcon />}
        </IconButton>
      </Box>
      {(results.round !== 'inProgress' || !playerState) && <LobbyRoom players={players} lobbyHash={lobbyHash} results={results} options={options} isHost={isHost} />}

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
