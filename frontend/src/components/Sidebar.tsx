import useWorkspaces from '@/hooks/useWorskpaces';
import { Plus } from 'lucide-react';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';
import { Accordion } from './ui/accordion';
import { ScrollArea } from './ui/scroll-area';
import { useLocalStorage } from '@uidotdev/usehooks';
import useWorkspaceStore from '@/stores/workspaceStore';
import SidebarItem from './SidebarItem';

const Sidebar = () => {
  const { isPending, data: workspaces } = useWorkspaces();
  const { activeId } = useWorkspaceStore();
  const [opened, setIsOpened] = useLocalStorage<Record<string, true>>(
    'opened_sidebar',
    {},
  );

  const toggle = (id: number) => {
    setIsOpened((prevOpened) => {
      const openedCopy = { ...prevOpened };
      if (prevOpened[id.toString()]) {
        delete openedCopy[id.toString()];
      } else {
        openedCopy[id.toString()] = true;
      }
      return openedCopy;
    });
  };

  if (isPending) return null;

  return (
    <aside className="flex h-full flex-col">
      <div className="flex h-10 items-center justify-between px-1">
        <span className="text-sm">Workspaces</span>
        <Button variant={'ghost'} type="button" asChild>
          <Link to={'/select-workspace'}>
            <Plus className="size-4" />
          </Link>
        </Button>
      </div>

      <Accordion
        type="multiple"
        className="flex-grow space-y-0 overflow-y-hidden"
        defaultValue={Object.keys(opened)}
      >
        <ScrollArea className="h-full">
          <ul role="list" className="mr-3">
            {workspaces?.map((workspace) => (
              <SidebarItem
                key={workspace.id}
                workspace={workspace}
                toggle={toggle}
                isActive={activeId === workspace.id}
                isOpened={!!opened[workspace.id]}
              />
            ))}
          </ul>
        </ScrollArea>
      </Accordion>
    </aside>
  );
};

export default Sidebar;
