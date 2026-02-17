import { IconButton } from '@mui/material';
import { HelpOutlined } from '@mui/icons-material';

export const HelpBtn = () => {
  return (
    <IconButton
      onClick={() => console.log('asdf')}
    >
      <HelpOutlined />
    </IconButton>
  );
};
