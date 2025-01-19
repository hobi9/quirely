import { Workspace } from '@/types/workspace';
import { Button } from '../ui/button';
import { Check, X } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { acceptWorkspaceInvitation } from '@/services/workspaceService';
import { pendingWorkspacesQueryOption } from '@/hooks/usePendingWorkspaces';
import { workspacesQueryOption } from '@/hooks/useWorskpaces';

const WorkspaceInvitationItem: React.FC<{ workspace: Workspace }> = ({
  workspace,
}) => {
  const queryClient = useQueryClient();

  const handleInvite = async (accept: boolean) => {
    await acceptWorkspaceInvitation(workspace.id, accept);
    await queryClient.invalidateQueries({
      predicate: (query) => {
        const queryJson = JSON.stringify(query.queryKey);
        return (
          queryJson === JSON.stringify(workspacesQueryOption.queryKey) ||
          queryJson === JSON.stringify(pendingWorkspacesQueryOption.queryKey)
        );
      },
    });
  };

  return (
    <div
      key={workspace.id}
      className="boder mr-2 border-b pl-0 last:border-b-0"
    >
      <span>
        You have been invited to join workspace
        <span className="font-bold"> {workspace.name}</span>
      </span>
      <div className="flex items-center gap-x-1">
        <Button
          variant="ghost"
          className="flex flex-1 items-center gap-x-1"
          onClick={() => handleInvite(true)}
        >
          <Check size={16} />
          <span>Join</span>
        </Button>
        <Button
          variant="ghost"
          className="flex flex-1 items-center gap-x-1"
          onClick={() => handleInvite(false)}
        >
          <X size={16} />
          <span>Refuse</span>
        </Button>
      </div>
    </div>
  );
};
export default WorkspaceInvitationItem;
