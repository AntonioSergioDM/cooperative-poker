/* eslint-disable react/no-array-index-key */

import {
  Box,
} from '@mui/material';

import type { LobbyState } from '@/shared/SocketTypes';

type ResultsProps = {
  results: LobbyState['results'];
};

const Results = ({ results }: ResultsProps) => {
  return (
    <Box
      margin={5}
      height="90vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      {/* TODO results*/}
    </Box>
  );
};

export default Results;
