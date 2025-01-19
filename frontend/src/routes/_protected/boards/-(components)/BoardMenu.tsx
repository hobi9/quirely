import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { boardQueryOptions } from '@/hooks/useBoard';
import { workspaceBoardsQueryOptions } from '@/hooks/useWorkspaceBoards';
import { deleteBoard } from '@/services/boardService';
import { Board } from '@/types/board';
import { useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from '@tanstack/react-router';
import { Ellipsis, X } from 'lucide-react';

const BoardMenu: React.FC<{ board: Board }> = ({ board }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const handleBoardDeletion = async () => {
    await deleteBoard(board.id);

    await Promise.all([
      queryClient.invalidateQueries(
        workspaceBoardsQueryOptions(board.workspaceId),
      ),
      queryClient.removeQueries(boardQueryOptions(board.id)),
    ]);

    navigate({
      to: '/workspaces/$workspaceId',
      params: { workspaceId: board.workspaceId },
      replace: true,
    });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="size-auto p-2" variant="transparent">
          <Ellipsis className="size-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="px-0 pb-3 pt-3" side="bottom" align="start">
        <div className="pb-4 text-center text-sm font-medium text-neutral-600">
          Board Menu
        </div>
        <PopoverClose asChild>
          <Button
            className="absolute right-2 top-2 size-auto p-2"
            variant="ghost"
          >
            <X className="size-4" />
          </Button>
        </PopoverClose>
        <Button
          variant={'ghost'}
          asChild
          className="h-auto w-full justify-start rounded-none px-5 py-2 text-sm font-normal"
        >
          <Link
            to="/workspaces/$workspaceId"
            params={{ workspaceId: board.workspaceId }}
          >
            Go to Workspace
          </Link>
        </Button>
        <Button
          variant={'ghost'}
          onClick={handleBoardDeletion}
          className="h-auto w-full justify-start rounded-none px-5 py-2 text-sm font-normal"
        >
          Delete this board
        </Button>
      </PopoverContent>
    </Popover>
  );
};
export default BoardMenu;
