import { IconButton } from '@mui/material';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import { useSoundState } from '@/client/tools/useSound';

export const SoundBtn = () => {
  const [muted, toggleMute] = useSoundState();

  return (
    <IconButton
      onClick={toggleMute}
    >
      {muted ? <VolumeOffIcon /> : <VolumeUpIcon />}
    </IconButton>
  );
};
