import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { boardListsQueryOptions } from '@/hooks/useBoardLists';
import { updateTask } from '@/services/taskService';
import { List } from '@/types/list';
import { Task } from '@/types/task';
import { useQueryClient } from '@tanstack/react-query';
import { useParams } from '@tanstack/react-router';
import { Layout } from 'lucide-react';
import { useRef, useState } from 'react';

const TaskModalHeader: React.FC<{ task: Task; list: List }> = ({
  task,
  list,
}) => {
  const [title, setTitle] = useState(task.title);
  const formRef = useRef<HTMLFormElement>(null);
  const queryClient = useQueryClient();
  const { boardId } = useParams({ from: '/_protected/boards/$boardId' });
  const { toast } = useToast();

  const handleBlur = () => {
    formRef.current?.requestSubmit();
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (title === task.title) return;

    await updateTask(task.id, { title });
    await queryClient.invalidateQueries(boardListsQueryOptions(boardId));
    toast({
      title: 'Task updated',
      description: `Task "${title}" has been updated.`,
    });
  };

  return (
    <div className="mb-6 flex w-full items-start gap-x-3">
      <Layout className="mt-3 size-5 text-neutral-700" />
      <div className="w-full">
        <form onSubmit={handleSubmit} ref={formRef}>
          <Input
            onBlur={handleBlur}
            onChange={(e) => setTitle(e.target.value)}
            id="title"
            value={title}
            className="focus-visible:border-input relative -left-1.5 mb-0.5 w-[95%] truncate border-0 border-transparent bg-transparent px-1 py-0 text-xl font-semibold text-neutral-700 focus-visible:bg-white"
          />
        </form>
        <p className="text-muted-foreground text-sm">
          in list <span className="underline">{list.title}</span>
        </p>
      </div>
    </div>
  );
};

export default TaskModalHeader;
