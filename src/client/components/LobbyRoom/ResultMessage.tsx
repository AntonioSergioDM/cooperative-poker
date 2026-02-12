import { Card, Typography } from '@mui/material';
import type { ColorNames } from '@/client/tools/colors';
import { getColorHex } from '@/client/tools/colors';

type ResultsMessageProps = {
  message: any;
  color?: ColorNames;
};

const ResultMessage = (props: ResultsMessageProps) => {
  const {
    message,
    color,
  } = props;
  const myColor = color && getColorHex(color);
  return (
    <Card
      style={{
        border: `1px solid ${myColor || 'transparent'}`,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '50px',
        boxShadow: `0 0 8px ${myColor || 'transparent'}`,
      }}
    >
      <Typography color={myColor || 'inherit'} margin="auto" marginX={2} fontSize={20} fontWeight="bold">{message}</Typography>
    </Card>
  );
};

export default ResultMessage;
