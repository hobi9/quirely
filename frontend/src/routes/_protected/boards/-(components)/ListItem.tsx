import { List } from '@/types/list';
import ListHeader from './ListHeader';
import TaskForm from './TaskForm';
import { useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import TaskItem from './Taskitem';

const ListItem: React.FC<{ index: number; list: List }> = ({ list, index }) => {
  const [isEditing, setIsEditing] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      textAreaRef.current?.focus();
    });
  };

  const disableEditing = () => {
    setIsEditing(false);
  };

  return (
    <li className="h-full w-[272px] shrink-0 select-none">
      <div className="w-full rounded-md bg-[#f1f2f4] pb-2 shadow-md">
        <ListHeader list={list} handleAddTask={enableEditing} />
        <ol
          className={cn(
            'mx-1 flex flex-col gap-y-2 px-1 py-0.5',
            list.tasks.length ? 'mt-2' : 'mt-0',
          )}
        >
          {list.tasks.map((task, index) => (
            <TaskItem key={task.id} task={task} index={index} />
          ))}
        </ol>
        <TaskForm
          listId={list.id}
          ref={textAreaRef}
          isEditing={isEditing}
          enableEditing={enableEditing}
          disableEditing={disableEditing}
        />
      </div>
    </li>
  );
};
export default ListItem;
