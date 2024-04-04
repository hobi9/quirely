import { ScrollArea } from './ui/scroll-area';
import { ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import defaultLogo from '../assets/workspace-default.png';
import useWorkspaces from '@/hooks/useWorskpaces';
import { Link } from '@tanstack/react-router';

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
                <div className="flex items-center  gap-x-2">
                  {
                    <img
                      src={workspace.logoUrl || defaultLogo}
                      className="size-8 rounded-sm  object-cover"
                      alt={`workspace ${workspace.name} logo`}
                    />
                  }
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
