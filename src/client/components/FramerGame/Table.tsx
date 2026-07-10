import { Box } from '@mui/material';
import type { GameState } from '@/shared/GameTypes';
import TableCard from '@/client/components/FramerGame/TableCard';
import TableChip from '@/client/components/FramerGame/TableChip';
import type { Chip } from '@/shared/Chip';

type TableProps = {
  gameState: GameState;
  onStealChip: (chip: Chip) => void;
  cardWidth: number;
  chipSize: number;
  scale: number;
};

const Table = (props: TableProps) => {
  const {
    gameState,
    onStealChip,
    cardWidth,
    chipSize,
    scale,
  } = props;

  return (
    <Box
      className="border-2 border-solid border-poker-highlight border-opacity-20 rounded-2xl"
      sx={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: `${Math.round(24 * scale)}px`,
        alignItems: 'center',
        background: 'rgba(0, 0, 0, 0.3)',
        padding: `${Math.round(24 * scale)}px`,
        backdropFilter: 'blur(4px)',
        boxShadow: 'inset 0 2px 20px rgba(0, 0, 0, 0.5), 0 8px 32px rgba(0, 0, 0, 0.3)',
      }}
    >
      {/* Community Cards */}
      <div className="flex flex-row justify-center" style={{ gap: `${Math.round(16 * scale)}px` }}>
        {/* eslint-disable-next-line react/jsx-key */}
        {gameState.table.map((card) => (<TableCard card={card} width={cardWidth} />))}
      </div>

      {/* Table Chips */}
      <div className="flex flex-row justify-center flex-wrap" style={{ gap: `${Math.round(12 * scale)}px` }}>
        {/* eslint-disable-next-line react/jsx-key */}
        {gameState.tableChips.map((chip) => (<TableChip chip={chip} size={chipSize} onClick={onStealChip} />))}
      </div>
    </Box>
  );
};

export default Table;
