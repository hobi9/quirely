import { Workspace } from '@/types/workspace';
import { Bell, PanelsRightBottom, Settings } from 'lucide-react';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { Link, useRouterState } from '@tanstack/react-router';
import WorkspaceImage from './ui/image/workspace-image';

type Props = {
  workspace: Workspace;
  isActive: boolean;
  isOpened: boolean;
  toggle: (id: number) => void;
};

const SidebarItem = ({ workspace, isActive, isOpened, toggle }: Props) => {
  const { location } = useRouterState();
  const routes: Array<{
    type: string;
    icon: React.ReactElement;
    link: string;
    matches(): boolean;
  }> = [
    {
      type: 'Boards',
      icon: <PanelsRightBottom className="size-4" />,
      link: `/workspaces/${workspace.id}`,
      matches() {
        return location.pathname === this.link;
      },
    },
    {
      type: 'Activity',
      icon: <Bell className="size-4" />,
      link: `/workspaces/${workspace.id}/activity`,
      matches() {
        return location.pathname === this.link;
      },
    },
    {
      type: 'Settings',
      icon: <Settings className="size-4" />,
      link: `/workspaces/${workspace.id}/settings`,
      matches() {
        return location.pathname.startsWith(this.link);
      },
    },
  ];
  //TODO: add skeleton
  return (
    <AccordionItem
      value={workspace.id.toString()}
      key={workspace.id}
      className="border-none"
    >
      <AccordionTrigger
        className={cn(
          'rounded-sm p-2 hover:bg-gray-500/10 hover:no-underline',
          isActive && !isOpened && 'bg-blue-600/10 text-blue-700',
        )}
        onClick={() => toggle(workspace.id)}
      >
        <div className="flex items-center gap-x-2">
          <WorkspaceImage workspace={workspace} className="size-7" />
          <span className="text-sm">{workspace.name}</span>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <ul>
          {routes.map((route) => (
            <Button
              key={route.type}
              asChild
              variant={'ghost'}
              className={cn(
                'w-full justify-start pl-10 font-normal hover:bg-none',
                route.matches() && 'bg-blue-600/10 text-blue-700',
              )}
            >
              <Link to={route.link} className="flex gap-x-2">
                {route.icon} <span>{route.type}</span>
              </Link>
            </Button>
          ))}
        </ul>
      </AccordionContent>
    </AccordionItem>
  );
};

export default SidebarItem;
