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
import type { PlayerState, GameOption } from '@/shared/GameTypes';

import type { Message } from '@/shared/Message';
import Game from './Game';
import type Player from './Player';

export type LobbyRoom = BroadcastOperator<DecorateAcknowledgementsWithMultipleResponses<ServerToClientEvents>, SocketData>;

export default class Lobby {
  static lobbies: Map<string, Lobby> = new Map();

  hash: string;

  players: Array<Player> = [];

  viewers: Array<Player> = [];

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
    let foundIndex = this.players.findIndex((p) => p.id === playerId);
    let player;

    if (foundIndex >= 0) {
      player = this.players.splice(foundIndex, 1)[0];
      this.resetGame();
    } else {
      foundIndex = this.viewers.findIndex((p) => p.id === playerId);
      if (foundIndex >= 0) {
        player = this.viewers.splice(foundIndex, 1)[0];
      }
    }

    if (!player) {
      return;
    }

    await player.leaveRoom(this.hash);

    if (IN_DEV) {
      console.info(`😘 PlayerID: ${playerId} left the lobby ${this.hash}\n`);
    }

    if (!this.players.length && !this.viewers.length) {
      Lobby.lobbies.delete(this.hash);

      if (IN_DEV) {
        console.info(`💀 Lobby ${this.hash} closed!\n`);
      }
    }
  }

  async addPlayer(player: Player): Promise<boolean> {
    if (this.players.length >= Game.maxPlayers) {
      return false;
    }

    player.name = player.name.length > 50 ? `${player.name.substring(0, 50)}...` : player.name;

    if (this.game.isEnded()) {
      this.players.push(player);
      this.emitLobbyUpdate();
    } else {
      this.viewers.push(player);
    }

    this.room = await player.joinRoom(this.hash);

    if (IN_DEV) {
      console.info(`😎 A player joined the Lobby ${this.hash}`);
      console.info(`      Players on Lobby ${this.hash}`);
      console.info(this.players.reduce((info, p, idx) => (`${info}       ${idx}.  ${p.name} (ID: ${p.id})\n`), ''));
    }

    return true;
  }

  setPlayerReady(playerId: string) {
    let player = this.viewers.find((p) => p.id === playerId);

    if (player) {
      return;
    }

    player = this.players.find((p) => p.id === playerId);
    if (!player) {
      return;
    }
    player.setReady();

    if (this.players.every((p) => p.ready) && this.players.length >= Game.minPlayers) {
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

  hasPlayer(playerId: any) {
    return this.players.some((p) => p.id === playerId) || this.viewers.some((p) => p.id === playerId);
  }

  changeOption(option: GameOption, status: boolean, playerId: string): string | boolean {
    const foundIdx = this.players.findIndex((p) => p.id === playerId);
    if (foundIdx === -1) {
      return 'Invalid player';
    }

    if (!this.game.isEnded()) {
      return 'Game in progress';
    }

    // Should check if is the host?

    if (status) {
      this.game.options.push(option);
    } else {
      this.game.options = this.game.options.filter((o) => o !== option);
    }

    this.emitLobbyUpdate();
    return status;
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

    if (this.game.shouldUpdateHands()) {
      this.players.forEach((player, idx) => {
        player.socket.emit('gameStart', {
          index: idx,
          hand: this.game.decks[idx],
          chip: null,
        });
      });
    }

    this.checkEnd();

    return {
      index: foundIdx,
      hand: this.game.decks[foundIdx],
      chip,
    };
  }

  emitLobbyUpdate() {
    this.room?.emit('playersListUpdated', {
      players: this.players.map((p) => ({ name: p.name, ready: p.ready, id: p.id })),
      results: this.game.getResults(),
      options: this.game.options,
    });
  }

  emitMessage(message: Message, from: string) {
    if (IN_DEV) {
      console.info(`Player ${from} sent a message`, message);
    }

    message.from = this.players.find((p) => p.id === from)?.name || from;
    message.timestamp = Date.now();

    this.players.forEach((player) => {
      if (player.id === from) return;
      if (message.to && message.to !== player.id) return;

      player.socket.emit('message', message);
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
      this.resetGame();
    }, 3000);

    return true;
  }

  private resetGame() {
    while (this.viewers.length && this.players.length < Game.maxPlayers) {
      this.players.push(this.viewers.pop()!);
    }

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
