import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { boardListsQueryOptions } from '@/hooks/useBoardLists';
import { useTaskModal } from '@/hooks/useTaskModal';
import { deleteTask, duplicateTask } from '@/services/taskService';
import { Task } from '@/types/task';
import { useQueryClient } from '@tanstack/react-query';
import { useParams } from '@tanstack/react-router';
import { Copy, Trash } from 'lucide-react';

const TaskModalActions: React.FC<{ task: Task }> = ({ task }) => {
  const queryClient = useQueryClient();
  const { boardId } = useParams({ from: '/_protected/boards/$boardId' });
  const close = useTaskModal((state) => state.close);
  const { toast } = useToast();

  const handleDelete = async () => {
    await deleteTask(task.id);
    await queryClient.invalidateQueries(boardListsQueryOptions(boardId));
    toast({
      title: 'Task deleted',
      description: `Task "${task.title}" has been deleted.`,
    });
    close();
  };

  const handleCopy = async () => {
    await duplicateTask(task.id);
    await queryClient.invalidateQueries(boardListsQueryOptions(boardId));
    toast({
      title: 'Task copied',
      description: `Task "${task.title}" has been copied.`,
    });
    close();
  };

  return (
    <div className="mt-2 space-y-2">
      <p className="text-xs font-semibold">Actions</p>
      <Button
        variant={'gray'}
        size={'inline'}
        onClick={handleCopy}
        className="w-full justify-start"
      >
        <Copy className="mr-2 size-4" /> Copy
      </Button>
      <Button
        variant={'gray'}
        size={'inline'}
        onClick={handleDelete}
        className="w-full justify-start"
      >
        <Trash className="mr-2 size-4" /> Delete
      </Button>
    </div>
  );
};

export default TaskModalActions;
