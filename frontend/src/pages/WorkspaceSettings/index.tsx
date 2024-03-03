import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import useWorkspace from '@/hooks/useWorkspace';
import { Settings, Users } from 'lucide-react';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import defaultWorkspaceLogo from '../../assets/workspace-default.png';
import { cn } from '@/lib/utils';
import { Sheet } from '@/components/ui/sheet';

const SettingsPage = () => {
  const { data: workspace, isPending } = useWorkspace();
  const location = useLocation();

  const sidebarButtons: Array<{
    label: string;
    icon: React.ReactElement;
    path: string;
  }> = [
    {
      label: 'Members',
      icon: <Users size={16} />,
      path: `/workspace/${workspace?.id}/settings`,
    },
    {
      label: 'Settings',
      icon: <Settings size={16} />,
      path: `/workspace/${workspace?.id}/settings/workspace-settings`,
    },
  ];

  //TODO: add skeleton
  if (isPending) return null;

  return (
    <Card className="flex h-[604px] w-full border">
      <div className="hidden w-60 basis-60 flex-col border-r px-5 py-9 lg:flex">
        <div className="flex items-center gap-x-4">
          <img
            src={workspace?.logoUrl || defaultWorkspaceLogo}
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
        <Routes>
          <Route path="" element={<div>Parent</div>} />
          <Route path="workspace-settings" element={<div>Setting</div>} />
          <Route path="*" element={<div>404</div>} />
        </Routes>
      </div>
    </Card>
  );
};
export default SettingsPage;
