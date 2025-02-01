import { List } from '@/types/list';
import ListHeader from './ListHeader';

const ListItem: React.FC<{ index: number; list: List }> = ({ list, index }) => {
  return (
    <li className="h-full w-[272px] shrink-0 select-none">
      <div className="w-full rounded-md bg-[#f1f2f4] pb-2 shadow-md">
        <ListHeader list={list} />
      </div>
    </li>
  );
};
export default ListItem;
