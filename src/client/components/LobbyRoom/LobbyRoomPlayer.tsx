import { useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';

import {
  Stack,
  Avatar,
  Skeleton,
  Typography,
  Box,
  IconButton,
} from '@mui/material';

import { useSocket } from '@/client/tools/useSocket';
import { Close } from '@mui/icons-material';
import getInitials from '../../tools/getInitials';

type LobbyRoomPlayerProps = {
  name?: string;
  ready?: boolean;
  canKick?: boolean;
  id?: string;
};

const SIZE = 85;
const MAX_WIDTH = 120;

const LobbyRoomPlayer = ({
  name, ready, canKick, id,
}: LobbyRoomPlayerProps) => {
  const socket = useSocket();
  const kickFromLobby = useCallback((playerId: string) => {
    socket.emit('kickFromLobby', playerId);
  }, [socket]);

  const content = useMemo(() => {
    if (!name) {
      return (
        <Box
          sx={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: 3,
            p: 2,
            border: '2px dashed rgba(255, 255, 255, 0.1)',
          }}
        >
          <Skeleton variant="circular" width={SIZE} height={SIZE} sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)' }} />
          <Skeleton variant="rounded" width={SIZE} height={25} sx={{ mt: 1, bgcolor: 'rgba(255, 255, 255, 0.1)' }} />
        </Box>
      );
    }

    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.3 }}
      >
        <Box
          sx={{
            background: ready
              ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(21, 128, 61, 0.2) 100%)'
              : 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(185, 28, 28, 0.2) 100%)',
            borderRadius: 3,
            p: 2,
            border: ready ? '2px solid rgba(34, 197, 94, 0.4)' : '2px solid rgba(239, 68, 68, 0.4)',
            boxShadow: ready
              ? '0 4px 12px rgba(34, 197, 94, 0.3), inset 0 1px 0 rgba(255,255,255,0.1)'
              : '0 4px 12px rgba(239, 68, 68, 0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
            transition: 'all 0.3s ease',
            position: 'relative',
          }}
        >
          {canKick && id && (
            <IconButton
              onClick={() => kickFromLobby(id)}
              size="small"
              className="absolute top-0 right-0"
            >
              <Close className="w-5 h-5" />
            </IconButton>
          )}

          <Avatar
            sx={{
              width: SIZE,
              height: SIZE,
              background: 'linear-gradient(135deg, #9333ea 0%, #7c3aed 100%)',
              boxShadow: '0 4px 12px rgba(147, 51, 234, 0.4)',
              border: '3px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <Typography variant="h4" fontWeight={700}>
              {getInitials(name)}
            </Typography>
          </Avatar>

          <Typography
            variant="body1"
            textAlign="center"
            overflow="hidden"
            maxWidth={MAX_WIDTH}
            sx={{
              mt: 1.5,
              fontWeight: 600,
              color: ready ? '#22c55e' : '#ef4444',
              textShadow: ready
                ? '0 2px 4px rgba(34, 197, 94, 0.5)'
                : '0 2px 4px rgba(239, 68, 68, 0.5)',
            }}
          >
            {name}
          </Typography>
        </Box>
      </motion.div>
    );
  }, [canKick, id, kickFromLobby, name, ready]);

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
