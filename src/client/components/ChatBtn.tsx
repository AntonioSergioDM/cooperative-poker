import {
  IconButton,
  badgeClasses, Badge, styled,
} from '@mui/material';
import { ChatBubbleOutlineRounded } from '@mui/icons-material';
import { useCallback, useEffect, useState } from 'react';
import { useSocket } from '@/client/tools/useSocket';
import type { Message } from '@/shared/Message';
import { MessageType } from '@/shared/Message';
import { ChatDialog } from './ChatDialog';

const ChatBadge = styled(Badge)`
  & .${badgeClasses.badge} {
    top: -12px;
    left: 0;
  }
`;

export const ChatBtn = () => {
  const [open, setOpen] = useState(false);
  const socket = useSocket();

  const [messages, setMessages] = useState<Message[]>([]);

  const [unreadMessages, setUnreadMessages] = useState<number>(0);
  const handleOpen = () => {
    setUnreadMessages(0);
    setOpen(true);
  };

  const onMessageReceived = useCallback((message: Message) => setMessages([...messages, message]), [messages]);

  useEffect(() => {
    const cleanup = () => {
      socket.off('message', onMessageReceived);
    };

    socket.off('message', onMessageReceived);

    return () => {
      cleanup();
    };
  }, [onMessageReceived, socket]);

  const sendMessage = useCallback((msg: string) => {
    const message = {
      type: MessageType.message,
      timestamp: Date.now(),
      msg,
      to: 'all',
      from: 'Player', // TODO
    };
    socket.emit('message', message);
    onMessageReceived(message);
  }, [onMessageReceived, socket]);

  const handleClose = () => setOpen(false);

  return (
    <>
      <IconButton onClick={handleOpen}>
        {unreadMessages ? <ChatBadge badgeContent={unreadMessages} color="error" /> : null}
        <ChatBubbleOutlineRounded />
      </IconButton>
      <ChatDialog
        open={open}
        onClose={handleClose}
        messages={messages}
        sendMessage={sendMessage}
      />
    </>
  );
};
