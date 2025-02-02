import { Task } from '@/types/task';

const TaskItem: React.FC<{
  task: Task;
  index: number;
}> = ({ task }) => {
  return (
    <div
      role="button"
      className="truncate rounded-md border-2 border-transparent bg-white px-3 py-2 text-sm shadow-sm hover:border-black"
    >
      {task.title}
    </div>
  );
};
export default TaskItem;
