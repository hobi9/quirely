import clsx from 'clsx';
import useAuthStore from '../stores/authStore';
import Avatar from './Avatar';
import Logo from './Logo';
import { Button } from './ui/button';
import WorkspaceSwitcher from './WorkspaceSwitcher';
import { Plus } from 'lucide-react';

const Navbar = () => {
  const user = useAuthStore((state) => state.user);
  return (
    <header className="fixed top-0 z-50 h-14 w-full bg-slate-50 shadow-md">
      <div className="flex h-full items-center justify-between px-5">
        <div className="flex h-4 items-center gap-x-5">
          <div className="hidden md:block">
            <Logo />
          </div>
          <Button>
            <span className="hidden md:block">Create</span>
            <Plus className="md:hidden" size={16} />
          </Button>
        </div>
        <div className="flex items-center gap-x-4">
          <WorkspaceSwitcher />
          <div className={clsx(!user && 'hidden')}>
            <Avatar />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
