import type { LobbyPlayerState, LobbyState } from '@/shared/SocketTypes';
import { Stack, Typography, Card } from '@mui/material';
import TableCard from '@/client/components/FramerGame/TableCard';
import TableChip from '@/client/components/FramerGame/TableChip';
import ResultCounter from '@/client/components/LobbyRoom/ResultCounter';
import ResultMessage from '@/client/components/LobbyRoom/ResultMessage';
import type { ColorNames } from '@/client/tools/colors';

type ResultsProps = {
  results: LobbyState['results'];
  players: LobbyPlayerState[];
};

const Results = ({ results, players }: ResultsProps) => {
  if (results.players.length !== players.length) return null;
  results.players.sort((playerB, playerA) => ((playerB.rank?.value || 0) - (playerA.rank?.value || 0)) || ((playerA.chip?.value || 0) - (playerB.chip?.value || 0)));
  const playerOrder = results.players.map((player) => ({
    chip: player.chip,
    name: players[player.index].name,
    hand: player.hand,
    rank: player.rank,
  }));

  let resultColor: ColorNames;
  if (results.round === 'win') {
    resultColor = 'green';
  } else if (results.round === 'lose') {
    resultColor = 'red';
  }

  return (
    <Stack direction="column" spacing={2}>
      <Stack direction="row" spacing={5} justifyContent="center" alignItems="start">
        <ResultCounter content={results.score[0]} label="lost" color="red" emoji="💀" />

        {/* @ts-ignore */}
        <ResultMessage color={resultColor} message={results.score.reduce((a, b) => a + b) ? `You ${results.round}!` : 'Ready when you are'} />

        <ResultCounter content={results.score[1]} label="win" color="green" emoji="🏆" />
      </Stack>
      <Stack direction="row" spacing={-5} width="full" justifyContent="center">
        {results.table.map((card) => (
          <TableCard card={card} key={`${card.value} - ${card.suit}`} />
        ))}
      </Stack>
      <Stack direction="row" spacing={2} overflow="auto" width="full" justifyContent="center">
        {playerOrder.map((player, idx) => (
          <Card
            key={`${player.name}-${player.chip?.value}`}
            sx={{
              padding: '4px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'end',
              minWidth: '150px',
              opacity: 0,
              animation: 'fadeIn 0.5s ease-out forwards',
              animationDelay: `${idx * 1.5}s`,
            }}
          >
            <Typography variant="body2" textAlign="center" maxWidth={150}>{player.name}</Typography>

            <Stack direction="row" spacing={-5}>
              {player.hand.map((card) => (
                <TableCard card={card} key={card.value} />
              ))}
            </Stack>

            {player.rank?.handName && <Typography variant="body2">{player.rank.handName}</Typography>}
            <Stack direction="row" gap={1.5}>
              <TableChip chip={player.chip!} onClick={() => (console.log('why are you clicking'))} />
              <TableChip chip={{ value: idx + 1, color: 'green', reverse: false }} onClick={() => (console.log('why are you clicking'))} />
            </Stack>
          </Card>
        ))}
      </Stack>
    </Stack>
  );
};

export default Results;
