import { useMemo } from 'react';
import { io, type Socket } from 'socket.io-client';

import type { ClientToServerEvents, ServerToClientEvents } from '@/shared/SocketTypes';
import { SiteRoute } from '@/shared/Routes';

let socket: Socket<ServerToClientEvents, ClientToServerEvents>;

const getSocket = () => {
  if (socket) {
    return socket;
  }

  console.info('Initializing socket');

  socket = io({
    path: SiteRoute.Socket,
    autoConnect: false,
  });

  socket.on('connect', () => {
    console.info('connected');
  });

  socket.connect();

  return socket;
};

export const useSocket = () => (
  useMemo(() => getSocket(), [])
);
