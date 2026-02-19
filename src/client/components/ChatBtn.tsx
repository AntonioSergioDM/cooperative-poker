import {
  IconButton,
  badgeClasses, Badge, styled,
} from '@mui/material';
import { ChatBubbleOutlineRounded } from '@mui/icons-material';
import { useState } from 'react';
import { ChatDialog } from './ChatDialog';

const ChatBadge = styled(Badge)`
  & .${badgeClasses.badge} {
    top: -12px;
    left: 0;
  }
`;

export const ChatBtn = () => {
  const [open, setOpen] = useState(false);

  const [unreadMessages, setUnreadMessages] = useState<number>(0);
  const handleOpen = () => {
    setUnreadMessages(0);
    setOpen(true);
  };

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
      />
    </>
  );
};
