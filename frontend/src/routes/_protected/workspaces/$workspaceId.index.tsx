import { createFileRoute } from '@tanstack/react-router';
import useWorkspace from '@/hooks/useWorkspace';
import WorkspaceImage from '@/components/ui/image/workspace-image';

export const Route = createFileRoute('/_protected/workspaces/$workspaceId/')({
  component: BoardsPage,
});

function BoardsPage() {
  const workspace = useWorkspace();

  return (
    <div className="w-full">
      <div className="flex items-center gap-x-4 border-b-2 border-gray-300/50 pb-4">
        <WorkspaceImage workspace={workspace} className="size-[60px]" />
        <p className="text-xl font-semibold">{workspace.name}</p>
      </div>
    </div>
  );
}
