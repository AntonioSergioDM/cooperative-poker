import type { LobbyPlayerState, LobbyState } from '@/shared/SocketTypes';
import { Stack, Typography, Card } from '@mui/material';
import TableCard from '@/client/components/FramerGame/TableCard';
import TableChip from '@/client/components/FramerGame/TableChip';

type ResultsProps = {
  results: LobbyState['results'];
  players: LobbyPlayerState[];
};

const Results = ({ results, players }: ResultsProps) => {
  if (results.players.length !== players.length) return null;
  results.players.sort((playerB, playerA) => ((playerB.rank?.value || 0) - (playerA.rank?.value || 0)) || ((playerA.chip?.value || 0) - (playerB.chip?.value || 0)));
  const playerOrder = results.players.map((player) => ({ chip: player.chip, name: players[player.index].name, hand: player.hand, rank: player.rank }));
  return (
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
      <Stack direction="row" spacing={-5}>
        {results.table.map((card) => (
          <TableCard card={card} key={card.value} />
        ))}
      </Stack>
      <Stack direction="row" spacing={2} overflow="auto">
        {playerOrder.map((player, idx) => (
          <Card key={player.name}>
            <div className="mx-auto">
              <Typography variant="body2">{player.name}</Typography>
            </div>
            <Stack direction="row" spacing={-5}>
              {player.hand.map((card) => (
                <TableCard card={card} key={card.value} />
              ))}
            </Stack>

            {player.rank?.handName && <Typography variant="body2">{player.rank.handName}</Typography>}
            <Stack direction="row">
              <TableChip chip={player.chip!} onClick={() => (console.log('why are you clicking'))} />
              <TableChip chip={{ value: idx + 1, color: 'lime', reverse: false }} onClick={() => (console.log('why are you clicking'))} />
            </Stack>
          </Card>
        ))}
      </Stack>
    </Stack>
  );
};

export default Results;
