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
    <div
      className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  flex flex-col gap-4"
    >
      <div className="flex flex-row gap-4 justify-center">
        {/* eslint-disable-next-line react/jsx-key */}
        {gameState.table.map((card) => (<TableCard card={card} />))}
      </div>
      <div className="flex flex-row gap-4 justify-center">
        {/* eslint-disable-next-line react/jsx-key */}
        {gameState.tableChips.map((chip) => (<TableChip chip={chip} onClick={onStealChip} />))}
      </div>
    </div>
  );
};

export default Table;
