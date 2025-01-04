import { Plus } from 'lucide-react';
import Avatar from '@/components/Avatar';
import { Button } from '@/components/ui/button';
import MobileSidebar from '@/components/MobileSidebar';
import WorkspaceSwitcher from '@/components/WorkspaceSwitcher';
import Logo from '@/components/Logo';
import BoardCreationForm from './BoardCreationForm';
import FormPopover from '@/components/FormPopover';
import WorkspaceInvitationNotification from '@/components/WorkspaceInvitationNotification';
import { useMatch } from '@tanstack/react-router';

const AuthenticatedNavbar = () => {
  const pathname = useMatch({ strict: false, select: (s) => s.pathname });

  const showWorkspaceFeatures = pathname.startsWith('/workspaces');

  return (
    <header className="fixed top-0 z-50 h-14 w-full bg-slate-50 shadow-md">
      <div className="flex h-full items-center justify-between px-5">
        <div className="flex h-4 items-center md:gap-x-5">
          <div className="hidden md:block">
            <Logo />
          </div>
          {showWorkspaceFeatures && (
            <div className="mr-1 md:hidden">
              <MobileSidebar />
            </div>
          )}
          <FormPopover
            title="Create a new board"
            side="bottom"
            sideOffset={10}
            formContent={(closeButtonRef) => (
              <BoardCreationForm closeButtonRef={closeButtonRef} />
            )}
          >
            <Button>
              <span className="hidden md:block">Create</span>
              <Plus className="md:hidden" size={16} />
            </Button>
          </FormPopover>
        </div>
        <div className="flex items-center gap-x-4">
          {showWorkspaceFeatures && <WorkspaceSwitcher />}
          <WorkspaceInvitationNotification />
          <Avatar />
        </div>
      </div>
    </header>
  );
};

export default AuthenticatedNavbar;
