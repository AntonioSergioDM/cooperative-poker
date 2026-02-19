import {
  Dialog, DialogContent, DialogActions, TextField, List, ListItem, ListItemText, Typography, Box,
  IconButton, InputAdornment,
} from '@mui/material';
import { ReactNode, useEffect, useRef } from 'react';
import { useState } from 'react';
import { SendOutlined } from '@mui/icons-material';
import type { Message } from '@/shared/Message';

interface ChatDialogProps {
  open: boolean;
  onClose: () => void;
  messages: Message[];
  sendMessage: (msg: string) => void;
}

export const ChatDialog = ({ open, onClose, messages, sendMessage }: ChatDialogProps) => {
  const [inputValue, setInputValue] = useState('');

  const handleSend = () => {
    if (!inputValue.trim()) return;
    sendMessage(inputValue);
    setInputValue('');
  };

  // scroll to end
  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open]);

  const renderMessage = (msg: Message) => {
    let primaryText: ReactNode = msg.from;
    let secondaryText: ReactNode = msg.msg;
    let bgColor = 'transparent';

    switch (msg.type) {
      default:
        primaryText = <Typography variant="subtitle2">{msg.from}</Typography>;
        secondaryText = <Typography variant="body2">{msg.msg}</Typography>;
        break;
    }

    return (
      <ListItem key={msg.timestamp} alignItems="flex-start" sx={{ bgcolor: bgColor, borderRadius: 1, mb: 0.5 }}>
        <ListItemText
          primary={primaryText}
          secondary={secondaryText}
        />
      </ListItem>
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        className: 'casino-box max-w-[90vw] w-96 h-1/3 max-h-[50vh] absolute -right-3 top-4 p-4',
      }}
    >
      <DialogContent className="p-0">
        <Box className="overflow-y-auto flex flex-col justify-between">
          <List>
            {messages.map(renderMessage)}
          </List>
          <div ref={messagesEndRef} />
        </Box>
      </DialogContent>
      <DialogActions className="p-0">
        <TextField
          autoFocus
          margin="dense"
          id="message"
          label="Message"
          type="text"
          fullWidth
          variant="outlined"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSend();
            }
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={handleSend}
                  edge="end"
                >
                  <SendOutlined />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              color: 'white',
              '& fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.3)',
              },
              '&:hover fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.5)',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#FACC15', // poker-highlight
              },
            },
            '& .MuiInputLabel-root': {
              color: 'rgba(255, 255, 255, 0.7)',
            },
          }}
        />
      </DialogActions>
    </Dialog>
  );
};
