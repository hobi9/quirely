import { List } from '@/types/list';
import ListForm from './ListForm';
import ListItem from './ListItem';

const ListContainer: React.FC<{ lists: List[] }> = ({ lists }) => {
  return (
    <ol className="flex h-full gap-x-3">
      {lists.map((list, index) => (
        <ListItem key={list.id} list={list} index={index} />
      ))}
      <ListForm />
      <div className="w-1 shrink-0" />
    </ol>
  );
};
export default ListContainer;
