import { Box, IconButton } from '@mui/material';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import { useSoundState } from '@/client/tools/useSound';

export const SoundBtn = () => {
  const [muted, toggleMute] = useSoundState();

  return (
    <Box sx={{ position: 'absolute', width: '100%', zIndex: 1 }}>
      {/* The Absolute Positioned Button */}
      <IconButton
        onClick={toggleMute}
        sx={{ position: 'absolute', top: 16, right: 16 }}
      >
        {muted ? <VolumeOffIcon /> : <VolumeUpIcon />}
      </IconButton>
    </Box>
  );
};
