import type { LobbyState } from '@/shared/SocketTypes';
import { Stack, Typography, Card } from '@mui/material';

type ResultsProps = {
  results: LobbyState['results'];
};

const Results = ({ results }: ResultsProps) => (
  <Stack direction="column" spacing={2}>
    <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="stretch">
      <Card className="px-2 py-1">
        <Stack direction="column">
          <Typography fontSize={10} marginRight={2}>Lost</Typography>
          <Typography marginLeft="auto">{results.score[0]}</Typography>
        </Stack>
      </Card>

      <Card className="flex justify-center items-center px-8">
        <Typography fontSize={20}>
          {results.score.reduce((a, b) => a + b) ? `You ${results.round}` : 'Ready when you are'}
        </Typography>
      </Card>

      <Card className="px-2 py-1">
        <Stack direction="column">
          <Typography fontSize={10} marginLeft={2}>Won</Typography>
          <Typography marginLeft={0}>{results.score[1]}</Typography>
        </Stack>
      </Card>
    </Stack>
    <Stack direction="row" spacing={2} width="full" sx={{ justifyContent: 'space-evenly', alignItems: 'center' }}>
      cards
    </Stack>
  </Stack>
);

export default Results;
