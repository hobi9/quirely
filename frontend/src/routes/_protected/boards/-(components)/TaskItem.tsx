import { Task } from '@/types/task';
import { Draggable } from '@hello-pangea/dnd';

const TaskItem: React.FC<{
  task: Task;
  index: number;
}> = ({ task, index }) => {
  return (
    <Draggable draggableId={task.id.toString()} index={index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
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
