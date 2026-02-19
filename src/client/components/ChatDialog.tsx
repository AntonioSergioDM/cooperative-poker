import {
  Dialog, DialogContent, DialogActions, TextField, List, ListItem, ListItemText, Typography, Box,
  IconButton, InputAdornment,
} from '@mui/material';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { SendOutlined } from '@mui/icons-material';

export type MessageType = 'system' | 'player' | 'whisper';

export interface Message {
  id: string;
  type: MessageType;
  sender?: string;
  content: string;
  timestamp: number;
}

interface ChatDialogProps {
  open: boolean;
  onClose: () => void;
}

const initialMessages: Message[] = [
  { id: '1', type: 'system', content: 'Player 1 has joined the game.', timestamp: Date.now() },
  { id: '2', type: 'player', sender: 'Player 2', content: 'Hello everyone!', timestamp: Date.now() },
  { id: '3', type: 'whisper', sender: 'Player 3', content: 'Are you ready?', timestamp: Date.now() },
];

export const ChatDialog = ({ open, onClose }: ChatDialogProps) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');

  const handleSend = () => {
    if (!inputValue.trim()) return;
    console.log('Sending:', inputValue);
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
    let primaryText: ReactNode = msg.sender;
    let secondaryText: ReactNode = msg.content;
    let bgColor = 'transparent';

    switch (msg.type) {
      case 'system':
        primaryText = <Typography variant="subtitle2" color="primary">System</Typography>;
        secondaryText = <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>{msg.content}</Typography>;
        bgColor = 'rgba(255, 255, 255, 0.05)';
        break;
      case 'whisper':
        primaryText = <Typography variant="subtitle2" color="secondary">{msg.sender} (whisper)</Typography>;
        secondaryText = <Typography variant="body2">{msg.content}</Typography>;
        bgColor = 'rgba(250, 204, 21, 0.1)'; // Yellowish tint for whisper
        break;
      case 'player':
      default:
        primaryText = <Typography variant="subtitle2">{msg.sender}</Typography>;
        secondaryText = <Typography variant="body2">{msg.content}</Typography>;
        break;
    }

    return (
      <ListItem key={msg.id} alignItems="flex-start" sx={{ bgcolor: bgColor, borderRadius: 1, mb: 0.5 }}>
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
