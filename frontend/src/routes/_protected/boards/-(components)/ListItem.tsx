import { List } from '@/types/list';
import ListHeader from './ListHeader';
import TaskForm from './TaskForm';
import { useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import TaskItem from './TaskItem';
import { Draggable, Droppable } from '@hello-pangea/dnd';

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
    <Draggable draggableId={list.id.toString()} index={index}>
      {(provided) => (
        <li
          {...provided.draggableProps}
          ref={provided.innerRef}
          className="h-full w-[272px] shrink-0 select-none"
        >
          <div
            {...provided.dragHandleProps}
            className="w-full rounded-md bg-[#f1f2f4] pb-2 shadow-md"
          >
            <ListHeader list={list} handleAddTask={enableEditing} />
            <Droppable droppableId={list.id.toString()} type="card">
              {(provided) => (
                <ol
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={cn(
                    'mx-1 flex flex-col gap-y-2 px-1 py-0.5',
                    list.tasks.length ? 'mt-2' : 'mt-0',
                  )}
                >
                  {list.tasks.map((task, index) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      list={list}
                      index={index}
                    />
                  ))}
                  {provided.placeholder}
                </ol>
              )}
            </Droppable>
            <TaskForm
              listId={list.id}
              ref={textAreaRef}
              isEditing={isEditing}
              enableEditing={enableEditing}
              disableEditing={disableEditing}
            />
          </div>
        </li>
      )}
    </Draggable>
  );
};
export default ListItem;
