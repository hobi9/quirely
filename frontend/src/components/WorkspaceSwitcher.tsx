import { Button } from './ui/button';
import { Popover, PopoverTrigger, PopoverContent } from './ui/popover';
import { Building, ChevronsUpDown, Settings, Plus } from 'lucide-react';

const WorkspaceSwitcher = () => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant={'ghost'} className="group">
          <div className="flex items-center gap-x-4 transition group-hover:opacity-75">
            <div className="flex items-center gap-x-2 ">
              <div className="size-9 flex items-center justify-center rounded-md bg-red-500 text-slate-50">
                <Building size={28} />
              </div>
              <span className="w-28 overflow-hidden text-ellipsis">
                Another Inc.
              </span>
            </div>
            <ChevronsUpDown />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="flex items-center gap-x-2">
          <div className="size-11 flex items-center justify-center rounded-md bg-red-500 text-slate-50">
            <Building size={40} />
          </div>
          <div className="flex h-full flex-col text-ellipsis leading-none">
            <p className="w-52 overflow-hidden text-ellipsis whitespace-nowrap font-bold">
              Another Inc.
            </p>
            <p className="text-xs">Owner</p>
          </div>
        </div>
        <div className="mt-4">
          <div className="rounded-sm py-2 hover:bg-slate-100">
            <div className="flex items-center gap-x-1 text-slate-700">
              <Settings size={16} />
              <span>Manage Workspace</span>
            </div>
          </div>
          <div className="rounded-sm py-2 hover:bg-slate-100">
            <div className="flex items-center gap-x-1 text-slate-700">
              <Plus size={16} />
              <span>Create Workspace</span>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default WorkspaceSwitcher;
