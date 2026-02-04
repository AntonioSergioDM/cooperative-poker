import type { BroadcastOperator } from 'socket.io';
import type { DecorateAcknowledgementsWithMultipleResponses } from 'socket.io/dist/typed-events';

import {
  names,
  colors,
  animals,
  countries,
  adjectives,
  uniqueNamesGenerator,
} from 'unique-names-generator';

import type { ServerToClientEvents, SocketData } from '@/shared/SocketTypes';

import { IN_DEV } from '@/globals';
import type { Chip } from '@/shared/Chip';
import type { PlayerState } from '@/shared/GameTypes';

import Game from './Game';
import type Player from './Player';

export type LobbyRoom = BroadcastOperator<DecorateAcknowledgementsWithMultipleResponses<ServerToClientEvents>, SocketData>;

export default class Lobby {
  static lobbies: Map<string, Lobby> = new Map();

  hash: string;

  players: Array<Player> = [];

  game: Game = new Game();

  room: LobbyRoom | null = null;

  constructor() {
    this.hash = Lobby.generateNewHash();
  }

  static generateNewHash(): string {
    const newHash = IN_DEV ? Lobby.lobbies.size.toString() : uniqueNamesGenerator({
      dictionaries: [adjectives, colors, names, animals, countries],
      length: 3,
      separator: '-',
      style: 'lowerCase',
    });

    // In the very low case of generating a already existing
    // one call again until we get a unique name
    if (Lobby.lobbies.has(newHash)) {
      return this.generateNewHash();
    }

    return newHash;
  }

  async removePlayer(playerId: string) {
    const founIdx = this.players.findIndex((p) => p.id === playerId);
    if (founIdx === -1) {
      return;
    }

    const player = this.players.splice(founIdx, 1)[0];

    await player.leaveRoom(this.hash);

    if (IN_DEV) {
      console.info(`😘 PlayerID: ${playerId} left the lobby ${this.hash}\n`);
    }

    if (!this.players.length) {
      Lobby.lobbies.delete(this.hash);

      if (IN_DEV) {
        console.info(`💀 Lobby ${this.hash} closed!\n`);
      }

      return;
    }

    this.emitLobbyUpdate();
    this.resetGame();
  }

  async addPlayer(player: Player): Promise<boolean> {
    if (this.players.length >= Game.maxPlayers) {
      return false;
    }

    this.players.push(player);
    this.emitLobbyUpdate();
    this.room = await player.joinRoom(this.hash);

    if (IN_DEV) {
      console.info(`😎 A player joined the Lobby ${this.hash}`);
      console.info(`      Players on Lobby ${this.hash}`);
      console.info(this.players.reduce((info, p, idx) => (`${info}       ${idx}.  ${p.name} (ID: ${p.id})\n`), ''));
    }

    return true;
  }

  setPlayerReady(playerId: string) {
    let allReady = true;
    this.players.forEach((p) => {
      if (p.id === playerId) {
        p.setReady();
        if (IN_DEV) {
          console.info(`🫡  Player ${p.name} (ID: ${p.id}) is ready\n`);
        }
      }

      if (!p.ready) {
        allReady = false;
      }
    });

    if (allReady && this.players.length >= Game.minPlayers) {
      this.startGame();
    }

    this.emitLobbyUpdate();
  }

  setPlayerUnReady(playerId: string) {
    this.players.forEach((p) => {
      if (p.id === playerId) {
        p.setReady(false);
        if (IN_DEV) {
          console.info(`🫡  Player ${p.name} (ID: ${p.id}) is unReady\n`);
        }
      }
    });

    this.emitLobbyUpdate();
  }

  stealChip(playerId: string, chip: Chip | null): PlayerState | string {
    const foundIdx = this.players.findIndex((p) => p.id === playerId);
    if (foundIdx === -1) {
      return 'Invalid player';
    }

    if (!chip) {
      return 'Invalid chip';
    }

    if (IN_DEV) {
      console.info(`😉 PlayerID: ${playerId} steal ${chip.color} ${chip.value}\n`);
    }

    const playRes = this.game.stealChip(foundIdx, chip);

    if (typeof playRes === 'string') {
      return playRes;
    }

    if (IN_DEV) {
      console.info('    Chip Stolen');
    }

    this.emitGameChange();

    this.checkEnd();

    return {
      index: foundIdx,
      hand: this.game.decks[foundIdx],
      chip,
    };
  }

  emitLobbyUpdate() {
    this.room?.emit('playersListUpdated', {
      players: this.players.map((p) => ({ name: p.name, ready: p.ready })),
      results: this.game.getResults(),
    });
  }

  emitGameChange() {
    this.room?.emit('gameChange', this.game.getState());
  }

  private startGame() {
    this.game.start(this.players.length);

    if (IN_DEV) {
      console.info(`♠️ ♦️ Game started on Lobby ${this.hash} ♣️ ♥️\n`);
    }

    this.players.forEach((player, idx) => {
      player.socket.emit('gameStart', {
        index: idx,
        hand: this.game.decks[idx],
        chip: null,
      });
    });

    this.emitGameChange();
  }

  private checkEnd() {
    if (!this.game.isEnded()) {
      return false;
    }

    setTimeout(() => {
      this.players.forEach((p) => p.setReady(false));
      this.emitLobbyUpdate();
    }, 3000);

    return true;
  }

  private resetGame() {
    this.game = new Game();
    this.players.forEach((p) => {
      p.setReady(false);
      if (IN_DEV) {
        console.info(`🙃 Player ${p.name} (ID: ${p.id}) is no longer ready\n`);
      }
    });

    if (IN_DEV) {
      console.info(`🃏 Game restarted on Lobby ${this.hash}\n`);
    }

    this.room?.emit('gameReset');
    this.emitLobbyUpdate();
  }
}
