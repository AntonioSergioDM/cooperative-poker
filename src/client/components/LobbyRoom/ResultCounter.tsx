import { Card, Stack, Typography } from '@mui/material';
import type { ColorNames } from '@/client/tools/colors';
import { getColorHex } from '@/client/tools/colors';

type ResultsCounterProps = {
  content: any;
  color?: ColorNames;
  label?: string;
  emoji?: string;
};

const ResultCounter = (props: ResultsCounterProps) => {
  const {
    content,
    color,
    label,
    emoji,
  } = props;
  const myColor = color && getColorHex(color);
  return (
    <Stack direction="column" alignItems="center" justifyContent="center" style={{ position: 'relative' }}>
      {emoji && (
        <Card className="absolute rounded-full top-0 right-0 translate-x-1/2 -translate-y-1/2">
          <Typography margin="auto" fontSize={10}>{emoji}</Typography>
        </Card>
      )}
      <Card
        style={{
          border: `1px solid ${myColor || 'transparent'}`,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '50px',
          height: '50px',
        }}
      >
        <Typography margin="auto" fontSize={20} fontWeight="bold">{content}</Typography>
      </Card>
      <Typography color={myColor || 'inherit'} margin="auto" fontSize={15}>{label?.toUpperCase()}</Typography>
    </Stack>
  );
};

export default ResultCounter;
