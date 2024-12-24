import { createFileRoute } from '@tanstack/react-router';
import useWorkspace from '@/hooks/useWorkspace';
import WorkspaceImage from '@/components/ui/image/workspace-image';
import { UserRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BoardCreationPopover from '@/components/BoardCreationPopover';
import useWorkspaceBoards, {
  workspaceBoardsQueryOptions,
} from '@/hooks/useWorkspaceBoards';

export const Route = createFileRoute('/_protected/workspaces/$workspaceId/')({
  component: BoardsPage,
  loader: async ({ params, context: { queryClient } }) => {
    const { workspaceId } = params;
    await queryClient.ensureQueryData(workspaceBoardsQueryOptions(workspaceId));
  },
});

function BoardsPage() {
  const workspace = useWorkspace();
  const boards = useWorkspaceBoards();

  return (
    <div>
      <div className="mb-4 flex items-center gap-x-4">
        <WorkspaceImage workspace={workspace} className="size-[60px]" />
        <p className="text-xl font-semibold">{workspace.name}</p>
      </div>
      <hr className="border-t-2 border-gray-300/50 pt-4" />
      <div className="flex items-center gap-x-2">
        <UserRound className="size-6" />
        <span className="font-bold">Your boards</span>
      </div>
      <div className="mt-4">
        <BoardCreationPopover side="right" sideOffset={10}>
          <Button variant={'ghost'} className="aspect-video h-20">
            <span className="text-sm">Create a new Board</span>
          </Button>
        </BoardCreationPopover>
      </div>
      {boards.map((board) => (
        <div key={board.id}>{board.title}</div>
      ))}
    </div>
  );
}
