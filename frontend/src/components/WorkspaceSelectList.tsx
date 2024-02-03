import { ScrollArea } from './ui/scroll-area';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';
import defaultLogo from '../assets/workspace-default.png';
import useWorkspaces from '@/hooks/useWorskpaces';

const WorkspaceSelectList = () => {
  const { data: workspaces, isPending } = useWorkspaces();

  if (isPending) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="flex gap-x-2">
            <Skeleton className="size-7 rounded-md" />
            <Skeleton className="w-full rounded-md" />
          </div>
        ))}
      </div>
    );
  }

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
            <Link to={`/workspace/${workspace.id}`} replace>
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
