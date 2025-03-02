import { useTaskModal } from '@/hooks/useTaskModal';
import { List } from '@/types/list';
import { Task } from '@/types/task';
import { Draggable } from '@hello-pangea/dnd';

const TaskItem: React.FC<{
  task: Task;
  list: List;
  index: number;
}> = ({ task, list, index }) => {
  const openModal = useTaskModal((state) => state.open);
  return (
    <Draggable draggableId={task.id.toString()} index={index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          onClick={() => openModal(task, list)}
          role="button"
          className="truncate rounded-md border-2 border-transparent bg-white px-3 py-2 text-sm shadow-sm hover:border-black"
        >
          {task.title}
        </div>
      )}
    </Draggable>
  );
};
export default TaskItem;
