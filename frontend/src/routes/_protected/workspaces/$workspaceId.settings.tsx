import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Sheet } from '@/components/ui/sheet';
import useWorkspace from '@/hooks/useWorkspace';
import { cn } from '@/lib/utils';
import {
  Link,
  Outlet,
  createFileRoute,
  useRouterState,
} from '@tanstack/react-router';
import { Users, Settings } from 'lucide-react';
import defaultWorkspaceLogo from '../../../assets/workspace-default.png';

export const Route = createFileRoute(
  '/_protected/workspaces/$workspaceId/settings',
)({
  component: SettingsPage,
});

function SettingsPage() {
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
      path: `/workspaces/${workspace?.id}/settings`,
    },
    {
      label: 'Settings',
      icon: <Settings size={16} />,
      path: `/workspaces/${workspace?.id}/settings/workspace-settings`,
    },
  ];

  return (
    <Card className="flex h-[604px] w-full border">
      <div className="hidden w-60 basis-60 flex-col border-r px-5 py-9 lg:flex">
        <div className="flex items-center gap-x-4">
          <img
            src={workspace.logoUrl || defaultWorkspaceLogo}
            className="size-8 rounded-md object-cover"
          />
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
      <div className="flex-1 px-5 py-9">
        <Sheet></Sheet>
        <Outlet />
      </div>
    </Card>
  );
}
