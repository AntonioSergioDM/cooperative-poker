import { useCallback, useMemo } from 'react';

import {
  Stack,
  Avatar,
  Skeleton,
  Typography,
  Badge, Button,
} from '@mui/material';

import getInitials from '../../tools/getInitials';
import { useSocket } from '@/client/tools/useSocket';

type LobbyRoomPlayerProps = {
  name?: string;
  ready?: boolean;
  canKick?: boolean;
  id?: string;
};

const SIZE = 75;
const MAX_WIDTH = 100;

const LobbyRoomPlayer = ({ name, ready, canKick, id }: LobbyRoomPlayerProps) => {
  const socket = useSocket();
  const kickFromLobby = useCallback((playerId: string) => {
    socket.emit('kickFromLobby', playerId);
  }, [socket]);

  const content = useMemo(() => {
    if (!name) {
      return (
        <>
          <Skeleton variant="circular" width={SIZE} height={SIZE} />

          <Skeleton variant="rounded" width={SIZE} height={25} />
        </>
      );
    }

    return (
      <>
        <Badge
          badgeContent=" "
          overlap="circular"
          color={ready ? 'success' : 'error'}
        >
          <Avatar sx={{ width: SIZE, height: SIZE }}>
            <Typography variant="h5">{getInitials(name)}</Typography>
          </Avatar>
        </Badge>

        <Typography
          variant="body1"
          textAlign="center"
          overflow="hidden"
          maxWidth={MAX_WIDTH}
        >
          {name}
        </Typography>

        {canKick && id && <Button onClick={() => kickFromLobby(id)}>Kick</Button>}
      </>
    );
  }, [name, ready]);

  return (
    <Stack
      gap={2}
      width={MAX_WIDTH}
      direction="column"
      alignItems="center"
      justifyContent="flex-start"
    >
      {content}
    </Stack>
  );
};

export default LobbyRoomPlayer;
