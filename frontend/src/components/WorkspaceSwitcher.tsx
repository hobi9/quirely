import useWorkspaces from '@/hooks/useWorskpaces';
import { Popover, PopoverTrigger, PopoverContent } from './ui/popover';
import { ChevronsUpDown, Settings, Plus, ArrowRightLeft } from 'lucide-react';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { useCurrentUser } from '@/hooks/auth';
import useWorkspace from '@/hooks/useWorkspace';
import { Link } from '@tanstack/react-router';
import WorkspaceImage from './ui/image/workspace-image';

const WorkspaceSwitcher = () => {
  const workspaces = useWorkspaces();
  const activeWorkspace = useWorkspace();
  const user = useCurrentUser()!;

  return (
    <Popover>
      <PopoverTrigger className="group w-48 p-1">
        <div className="flex items-center justify-between gap-x-4 rounded-md transition group-hover:bg-blue-50 group-hover:opacity-75">
          <div className="flex items-center gap-x-2">
            <div className="flex items-center justify-center overflow-hidden rounded-md text-slate-50">
              <WorkspaceImage workspace={activeWorkspace} className="size-9" />
            </div>
            <span className="max-w-28 overflow-hidden text-ellipsis text-nowrap">
              {activeWorkspace.name}
            </span>
          </div>
          <ChevronsUpDown />
        </div>
      </PopoverTrigger>
      <PopoverContent>
        <div className="flex items-center gap-x-2">
          <div className="flex items-center justify-center overflow-hidden rounded-md text-slate-50">
            <WorkspaceImage workspace={activeWorkspace} className="size-11" />
          </div>
          <div className="flex h-full flex-col text-ellipsis leading-none">
            <p className="w-52 overflow-hidden text-ellipsis whitespace-nowrap font-bold">
              {activeWorkspace.name}
            </p>
            <p className="text-xs">
              {activeWorkspace.owner.id === user.id ? 'Owner' : 'Member'}
            </p>
          </div>
        </div>
        <div className="mt-4">
          <Button variant={'ghost'} className="mb-1 w-full pl-0">
            <div className="flex w-full items-center gap-x-1 pl-1 text-slate-700">
              <Settings size={16} />
              <span>Manage Workspace</span>
            </div>
          </Button>
          <ScrollArea>
            <ul role="list" className="flex max-h-40 flex-col space-y-2">
              {workspaces
                .filter((workspace) => workspace.id !== activeWorkspace!.id)
                .map((workspace) => (
                  <Button
                    key={workspace.id}
                    asChild
                    variant={'ghost'}
                    className="mr-2 pl-0"
                  >
                    <Link
                      to={'/workspaces/$workspaceId'}
                      params={{ workspaceId: workspace.id }}
                    >
                      <div className="flex w-full items-center justify-between pl-1">
                        <div className="flex items-center gap-x-1">
                          <WorkspaceImage
                            workspace={workspace}
                            className="size-8"
                          />
                          <span>{workspace.name}</span>
                        </div>
                        <ArrowRightLeft size={14} />
                      </div>
                    </Link>
                  </Button>
                ))}
            </ul>
          </ScrollArea>
          <Button variant={'ghost'} className="mt-1 w-full pl-0">
            <div className="flex w-full items-center gap-x-1 pl-1 text-slate-700">
              <Plus size={16} />
              <span>Create Workspace</span>
            </div>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default WorkspaceSwitcher;
