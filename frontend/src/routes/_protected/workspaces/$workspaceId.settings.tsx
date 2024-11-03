import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import useWorkspace from '@/hooks/useWorkspace';
import { cn } from '@/lib/utils';
import {
  Link,
  Outlet,
  createFileRoute,
  useRouterState,
} from '@tanstack/react-router';
import { Users, Settings, Menu } from 'lucide-react';
import { useState } from 'react';
import useIsMobile from '@/hooks/useIsMobile';
import Drawer from '@/components/Drawer';
import WorkspaceImage from '@/components/ui/image/workspace-image';

export const Route = createFileRoute(
  '/_protected/workspaces/$workspaceId/settings',
)({
  component: SettingsPage,
});

const SideBar = () => {
  const workspace = useWorkspace();
  const { location } = useRouterState();

  const sidebarButtons: Array<{
    label: string;
    icon: React.ReactElement;
    path: string;
  }> = [
    {
      label: 'Members',
      icon: <Users size={16} />,
      path: `/workspaces/${workspace.id}/settings`,
    },
    {
      label: 'Settings',
      icon: <Settings size={16} />,
      path: `/workspaces/${workspace.id}/settings/workspace-settings`,
    },
  ];

  return (
    <div className="w-60 basis-60 flex-col border-r px-5 py-9">
      <div className="flex items-center gap-x-4">
        <WorkspaceImage workspace={workspace} className="size-8" />
        <span className="overflow-hidden text-ellipsis text-nowrap text-sm">
          {workspace?.name}
        </span>
      </div>
      <ul className="mt-4 gap-y-1">
        {sidebarButtons.map((button) => (
          <Button
            key={button.label}
            variant={'ghost'}
            asChild
            className={cn(
              'w-full justify-start gap-x-4 pl-2',
              button.path === location.pathname &&
                'bg-blue-600/10 text-blue-700',
            )}
          >
            <Link to={button.path} className="flex gap-x-4">
              {button.icon}
              {button.label}
            </Link>
          </Button>
        ))}
      </ul>
    </div>
  );
};

function SettingsPage() {
  const [isOpened, setIsOpened] = useState(false);
  const isMobile = useIsMobile(1024);

  return (
    <Card className="relative flex h-[604px] w-full overflow-hidden border">
      <div className="hidden lg:flex">
        <SideBar />
      </div>
      {isOpened && isMobile && (
        <Drawer handleClose={() => setIsOpened(false)}>
          <SideBar />
        </Drawer>
      )}

      <div className="flex-1 px-5 py-9">
        <Button
          className="absolute top-1 flex items-center p-0 text-xs lg:hidden"
          variant={'ghost'}
          onClick={() => setIsOpened(true)}
        >
          <Menu size={12} />
          Menu
        </Button>

        <Outlet />
      </div>
    </Card>
  );
}
