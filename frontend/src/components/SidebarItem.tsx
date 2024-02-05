import { Workspace } from '@/types/workspace';
import { Bell, PanelsRightBottom, Settings } from 'lucide-react';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { Link, useLocation } from 'react-router-dom';
import defaultLogo from '../assets/workspace-default.png';

type Props = {
  workspace: Workspace;
  isActive: boolean;
  isOpened: boolean;
  toggle: (id: number) => void;
};

const SidebarItem = ({ workspace, isActive, isOpened, toggle }: Props) => {
  const location = useLocation();
  const routes: Array<{
    type: string;
    icon: React.ReactElement;
    link: string;
  }> = [
    {
      type: 'Boards',
      icon: <PanelsRightBottom className="size-4" />,
      link: `/workspace/${workspace.id}`,
    },
    {
      type: 'Activity',
      icon: <Bell className="size-4" />,
      link: `/workspace/${workspace.id}/activity`,
    },
    {
      type: 'Settings',
      icon: <Settings className="size-4" />,
      link: `/workspace/${workspace.id}/settings`,
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
          <img
            src={workspace.logoUrl || defaultLogo}
            className="size-7 rounded-sm object-cover"
          />
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
                location.pathname === route.link &&
                  'bg-blue-600/10 text-blue-700',
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
