import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import { boardListsQueryOptions } from '@/hooks/useBoardLists';
import { cloneList, deleteList } from '@/services/listService';
import { List } from '@/types/list';
import { useQueryClient } from '@tanstack/react-query';
import { useParams } from '@tanstack/react-router';
import { MoreHorizontal, X } from 'lucide-react';
import { useRef } from 'react';

const ListOptions: React.FC<{ list: List; handleAddTask: () => void }> = ({
  list,
  handleAddTask,
}) => {
  const { boardId } = useParams({
    from: '/_protected/boards/$boardId',
  });
  const popoverCloseRef = useRef<HTMLButtonElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleDeleteList = async () => {
    await deleteList(list.id);
    popoverCloseRef.current?.click();
    await queryClient.invalidateQueries(boardListsQueryOptions(boardId));
    toast({
      description: `List "${list.title}" deleted`,
    });
  };

  const handleCloneList = async () => {
    await cloneList(list.id);
    popoverCloseRef.current?.click();
    await queryClient.invalidateQueries(boardListsQueryOptions(boardId));
    toast({
      description: `List "${list.title}" copied`,
    });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="size-auto p-2" variant={'ghost'}>
          <MoreHorizontal className="size-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="px-0 pt-3 pb-3" side="bottom" align="start">
        <div className="pb-4 text-center text-sm font-medium text-neutral-600">
          List Actions
        </div>
        <PopoverClose ref={popoverCloseRef} asChild>
          <Button
            className="absolute top-2 right-2 h-auto p-2 text-neutral-600"
            variant={'ghost'}
          >
            <X className="size-4" />
          </Button>
        </PopoverClose>
        <Button
          onClick={handleAddTask}
          className="size-full justify-start rounded-none p-2 px-5 text-sm font-normal"
          variant={'ghost'}
        >
          Add Task
        </Button>
        <Button
          onClick={handleCloneList}
          className="size-full justify-start rounded-none p-2 px-5 text-sm font-normal"
          variant={'ghost'}
        >
          Copy list
        </Button>
        <hr />
        <Button
          onClick={handleDeleteList}
          className="size-full justify-start rounded-none p-2 px-5 text-sm font-normal"
          variant={'ghost'}
        >
          Delete this list
        </Button>
      </PopoverContent>
    </Popover>
  );
};
export default ListOptions;
