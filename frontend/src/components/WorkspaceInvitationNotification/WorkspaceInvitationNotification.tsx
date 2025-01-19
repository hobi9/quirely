import { Bell } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { ScrollArea } from '../ui/scroll-area';
import usePendingWorkspaces from '@/hooks/usePendingWorkspaces';
import WorkspaceInvitationItem from './WorkspaceInvitationItem';

const WorkspaceInvitationNotification = () => {
  const { data: pendingWorkspaces, isPending } = usePendingWorkspaces();

  return (
    <Popover>
      <PopoverTrigger>
        <div className="relative">
          <Bell className="size-9" />
          {!isPending && pendingWorkspaces!.length > 0 && (
            <span className="absolute right-0 top-[0px] w-min rounded-full bg-red-500 p-1 text-xs text-white">
              {pendingWorkspaces!.length > 9 ? '9+' : pendingWorkspaces!.length}
            </span>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent>
        {isPending ? (
          <div>Loading...</div>
        ) : pendingWorkspaces!.length === 0 ? (
          <div>No new invitations</div>
        ) : (
          <ScrollArea>
            <ul role="list" className="flex max-h-40 flex-col space-y-2">
              {pendingWorkspaces &&
                pendingWorkspaces.map((workspace) => (
                  <WorkspaceInvitationItem
                    key={workspace.id}
                    workspace={workspace}
                  />
                ))}
            </ul>
          </ScrollArea>
        )}
      </PopoverContent>
    </Popover>
  );
};
export default WorkspaceInvitationNotification;
