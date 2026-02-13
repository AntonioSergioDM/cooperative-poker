import { Box } from '@mui/material';
import type { GameState } from '@/shared/GameTypes';
import TableCard from '@/client/components/FramerGame/TableCard';
import TableChip from '@/client/components/FramerGame/TableChip';
import type { Chip } from '@/shared/Chip';

type TableProps = {
  gameState: GameState;
  onStealChip: (chip: Chip) => void;
};

const Table = (props: TableProps) => {
  const {
    gameState,
    onStealChip,
  } = props;

  return (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        alignItems: 'center',
        background: 'rgba(0, 0, 0, 0.3)',
        borderRadius: '24px',
        padding: 4,
        backdropFilter: 'blur(4px)',
        boxShadow: 'inset 0 2px 20px rgba(0, 0, 0, 0.5), 0 8px 32px rgba(0, 0, 0, 0.3)',
        border: '2px solid rgba(255, 215, 0, 0.2)',
      }}
    >
      {/* Community Cards */}
      <div className="flex flex-row gap-4 justify-center">
        {/* eslint-disable-next-line react/jsx-key */}
        {gameState.table.map((card) => (<TableCard card={card} />))}
      </div>

      {/* Table Chips */}
      <div className="flex flex-row gap-3 justify-center flex-wrap">
        {/* eslint-disable-next-line react/jsx-key */}
        {gameState.tableChips.map((chip) => (<TableChip chip={chip} onClick={onStealChip} />))}
      </div>
    </Box>
  );
};

export default Table;
