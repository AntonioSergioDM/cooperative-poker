import type { Socket as SocketIoSocket } from 'socket.io';

import type {
  GameResults,
  GameState,
  PlayerState,
} from '@/shared/GameTypes';
import type { Chip } from '@/shared/Chip';

export type LobbyPlayerState = { name: string; ready: boolean };
export type LobbyState = { players: LobbyPlayerState[]; results: GameResults };

export interface ServerToClientEvents {
  error: () => void;
  playersListUpdated: (lobby: LobbyState) => void;
  gameStart: (playerState: PlayerState) => void;
  gameChange: (gameState: GameState) => void;
  gameReset: () => void;
}

type GenericCallbackResponse<T = any> = {
  data: T;
  error?: never;
} | {
  data?: T;
  error: string;
};

export interface ClientToServerEvents {
  joinLobby: (lobbyHash: string, playerName: string, callback: (res: GenericCallbackResponse<{ lobbyHash: string }>) => void) => void;
  createLobby: (playerName: string, callback: (res: GenericCallbackResponse<{ lobbyHash: string }>) => void) => void;
  leaveLobby: () => void;
  lobbyPlayers: (lobbyHash: string, callback: (lobbyHash: string, players: LobbyPlayerState[]) => void) => void;
  playerReady: (callback: (playerIndex: number | null) => void) => void;
  stealChip: (chip: Chip, callback: (res: GenericCallbackResponse<PlayerState | null>) => void) => void;
}

/**
 * IDK?
 */
export interface InterServerEvents { }

/**
 * Data sent on connection
*/
export interface SocketData {
  lobbyHash: string | null;
  playerId: string | null;
}

export type OurServerSocket = SocketIoSocket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;
