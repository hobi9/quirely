import { ScrollArea } from './ui/scroll-area';
import { ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import useWorkspaces from '@/hooks/useWorskpaces';
import { Link } from '@tanstack/react-router';
import WorkspaceImage from './ui/image/workspace-image';

const WorkspaceSelectList = () => {
  const workspaces = useWorkspaces();

  return (
    <ScrollArea>
      <ul role="list" className="max-h-60 space-y-2">
        {workspaces?.map((workspace) => (
          <Button
            key={workspace.id}
            variant={'ghost'}
            asChild
            className="mr-3 block"
          >
            <Link
              to={'/workspaces/$workspaceId'}
              params={{ workspaceId: workspace.id }}
            >
              <div className="flex h-full items-center justify-between">
                <div className="flex items-center gap-x-2">
                  <WorkspaceImage workspace={workspace} className="size-8" />
                  <span className="max-w-72 overflow-hidden text-ellipsis">
                    {workspace.name}
                  </span>
                </div>
                <ArrowRight size={18} className="text-slate-500" />
              </div>
            </Link>
          </Button>
        ))}
      </ul>
    </ScrollArea>
  );
};

export default WorkspaceSelectList;
