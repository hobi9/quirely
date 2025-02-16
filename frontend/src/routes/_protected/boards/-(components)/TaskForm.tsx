import FormTextArea from '@/components/FormTextArea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { boardListsQueryOptions } from '@/hooks/useBoardLists';
import { createTask } from '@/services/taskService';
import { useQueryClient } from '@tanstack/react-query';
import { useParams } from '@tanstack/react-router';
import { Plus, X } from 'lucide-react';
import { forwardRef, useRef, useState } from 'react';
import { useEventListener, useOnClickOutside } from 'usehooks-ts';

type Props = {
  listId: number;
  enableEditing: () => void;
  disableEditing: () => void;
  isEditing: boolean;
};

const TaskForm = forwardRef<HTMLTextAreaElement, Props>(
  ({ listId, enableEditing, disableEditing, isEditing }, ref) => {
    const [taskValue, setTaskValue] = useState('');
    const queryClient = useQueryClient();
    const { boardId } = useParams({ from: '/_protected/boards/$boardId' });

    const { toast } = useToast();

    const formRef = useRef<HTMLFormElement>(null);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        disableEditing();
      }
    };

    useOnClickOutside(formRef, disableEditing);
    useEventListener('keydown', onKeyDown);

    const onTextAreaKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        formRef.current?.requestSubmit();
        setTaskValue('');
      }
    };

    const handleTaskCreation = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!taskValue.trim()) return;

      const task = await createTask(listId, {
        title: taskValue,
        description: '',
      });
      await queryClient.invalidateQueries(boardListsQueryOptions(boardId));
      toast({
        title: 'Task created',
        description: `Task "${task.title}" has been created.`,
      });
      setTaskValue('');
    };

    if (isEditing) {
      return (
        <form
          className="m-1 space-y-4 px-1 py-0.5"
          ref={formRef}
          onSubmit={handleTaskCreation}
        >
          <FormTextArea
            id="title"
            onKeyDown={onTextAreaKeyDown}
            ref={ref}
            placeholder="Enter a title for this card..."
            value={taskValue}
            onChange={(e) => setTaskValue(e.target.value)}
          />
          <div className="flex items-center gap-x-1">
            <Button>Add task</Button>
            <Button onClick={disableEditing} variant="ghost" size="sm">
              <X className="size-5" />
            </Button>
          </div>
        </form>
      );
    }
    return (
      <div className="px-2 pt-2">
        <Button
          onClick={enableEditing}
          className="text-muted-foreground h-auto w-full justify-start px-2 py-1.5 text-sm"
          size={'sm'}
          variant={'ghost'}
        >
          <Plus className="mr-2 size-4" />
          Add a task
        </Button>
      </div>
    );
  },
);

export default TaskForm;
