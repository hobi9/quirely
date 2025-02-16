import { Plus, X } from 'lucide-react';
import ListWrapper from './ListWrapper';
import { useRef, useState } from 'react';
import { useEventListener, useOnClickOutside } from 'usehooks-ts';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { createList } from '@/services/listService';
import { useQueryClient } from '@tanstack/react-query';
import { boardListsQueryOptions } from '@/hooks/useBoardLists';
import { useParams } from '@tanstack/react-router';

const ListForm = () => {
  const { boardId } = useParams({
    from: '/_protected/boards/$boardId',
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
    });
  };

  const disableEditing = () => {
    setIsEditing(false);
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      disableEditing();
    }
  };

  useEventListener('keydown', onKeyDown);
  useOnClickOutside(formRef, disableEditing);

  const handleListCreation = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!title.trim().length) {
      return;
    }

    const createdList = await createList(boardId, { title });
    console.log('boardId', boardId);
    await queryClient.invalidateQueries(boardListsQueryOptions(boardId));
    toast({
      description: (
        <span>
          List <span className="font-bold">"{createdList.title}"</span> created
          successfully
        </span>
      ),
    });
    disableEditing();
    setTitle('');
  };

  if (isEditing) {
    return (
      <ListWrapper>
        <form
          onSubmit={handleListCreation}
          className="w-full space-y-4 rounded-md bg-white p-3 shadow-md"
          ref={formRef}
        >
          <input
            ref={inputRef}
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="hover:border-input focus:border-input h-7 w-full border-transparent px-2 py-1 text-sm font-medium transition"
            placeholder="Enter list title..."
          />
          <div className="flex items-center gap-x-1">
            <Button>Add list</Button>
            <Button onClick={disableEditing} size={'sm'} variant={'ghost'}>
              <X className="size-5" />
            </Button>
          </div>
        </form>
      </ListWrapper>
    );
  }

  return (
    <ListWrapper>
      <button
        className="flex w-full items-center rounded-md bg-white/80 p-3 text-sm font-medium transition hover:bg-white/50"
        onClick={enableEditing}
      >
        <Plus className="mr-2 size-4" />
        Add a list
      </button>
    </ListWrapper>
  );
};
export default ListForm;
