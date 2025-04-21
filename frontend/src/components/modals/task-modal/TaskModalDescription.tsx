import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { boardListsQueryOptions } from '@/hooks/useBoardLists';
import { taskActivitiesQueryOptions } from '@/hooks/useTaskActivities';
import { updateTask } from '@/services/taskService';

import { Task } from '@/types/task';
import { useQueryClient } from '@tanstack/react-query';
import { useParams } from '@tanstack/react-router';

import { AlignLeft } from 'lucide-react';
import { useState, useRef } from 'react';
import { useEventListener, useOnClickOutside } from 'usehooks-ts';

const TaskModalDescription: React.FC<{ task: Task }> = ({ task }) => {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState(task.description || '');
  const { boardId } = useParams({ from: '/_protected/boards/$boardId' });

  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      textAreaRef.current?.focus();
    });
  };

  const disableEditing = () => {
    setIsEditing(false);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      disableEditing();
    }
  };

  useEventListener('keydown', onKeyDown);
  useOnClickOutside(formRef, disableEditing);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!description || description === task.description)
      return disableEditing();

    await updateTask(task.id, {
      description,
      title: task.title,
    });

    await Promise.all([
      queryClient.invalidateQueries(boardListsQueryOptions(boardId)),
      queryClient.invalidateQueries(taskActivitiesQueryOptions(task.id)),
    ]);

    disableEditing();
  };

  return (
    <div className="flex w-full items-start gap-x-3">
      <AlignLeft className="mt-0.5 size-5 text-neutral-700" />
      <div className="w-full">
        <p className="mb-2 font-semibold text-neutral-700">Description</p>
        {isEditing ? (
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-2">
            <Textarea
              id="description"
              className="mt-2 w-full"
              placeholder="Add a more detailed description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              ref={textAreaRef}
            />
            <div className="flex items-center gap-x-2">
              <Button size={'sm'}>Save</Button>
              <Button
                type="button"
                onClick={disableEditing}
                size={'sm'}
                variant={'ghost'}
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div
            onClick={enableEditing}
            role="button"
            className="min-h-[78px] rounded-md bg-neutral-200 px-3.5 py-3 text-sm font-medium"
          >
            {task.description || 'Add a more detailed description...'}
          </div>
        )}
      </div>
    </div>
  );
};
export default TaskModalDescription;
