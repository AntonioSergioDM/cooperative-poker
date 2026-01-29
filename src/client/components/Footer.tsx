import { Box, Typography } from '@mui/material';

const Footer = () => (
  <Box>
    <Typography variant="body2" color="text.secondary" align="center">
      {'Cooperative Poker © '}
      {new Date().getFullYear()}
    </Typography>
    <Typography variant="body2" color="text.secondary" align="center">
      {`Build ${process.env.BUILD_DATETIME}`}
    </Typography>
  </Box>
);

export default Footer;
