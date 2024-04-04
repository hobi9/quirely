import Avatar from './Avatar';
import Logo from './Logo';
import { Button } from './ui/button';
import WorkspaceSwitcher from './WorkspaceSwitcher';
import { Plus } from 'lucide-react';
import MobileSidebar from './MobileSidebar';
import { useCurrentUser } from '@/hooks/auth';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const user = useCurrentUser();

  return (
    <header className="fixed top-0 z-50 h-14 w-full bg-slate-50 shadow-md">
      <div className="flex h-full items-center justify-between px-5">
        <div className="flex h-4 items-center md:gap-x-5">
          <div className="hidden md:block">
            <Logo />
          </div>
          <div className="mr-1 md:hidden">
            <MobileSidebar />
          </div>
          <Button>
            <span className="hidden md:block">Create</span>
            <Plus className="md:hidden" size={16} />
          </Button>
        </div>
        <div className="flex items-center gap-x-4">
          <WorkspaceSwitcher />
          <div className={cn(!user && 'hidden')}>
            <Avatar />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
