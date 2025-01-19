import { Board } from '@/types/board';
import BoardTitleForm from './BoardTitleForm';
import BoardMenu from './BoardMenu';

const BoardNavbar: React.FC<{ board: Board }> = ({ board }) => {
  return (
    <div className="fixed top-14 z-40 flex h-14 w-full items-center gap-x-4 bg-black/50 px-6 text-white">
      <BoardTitleForm board={board} />
      <div className="ml-auto">
        <BoardMenu board={board} />
      </div>
    </div>
  );
};
export default BoardNavbar;
