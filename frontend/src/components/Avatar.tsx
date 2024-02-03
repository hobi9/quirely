import useAuthStore from '../stores/authStore';
import defaultAvatar from '../assets/defaultAvatar.svg';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Settings, LogOut } from 'lucide-react';
import { Button } from './ui/button';
import { signOut } from '@/services/authService';
import { useNavigate } from 'react-router-dom';

const Avatar = () => {
  const { fullName, avatarUrl, email } = useAuthStore((state) => state.user!);
  const setUser = useAuthStore((state) => state.setUser);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    setUser(null);
    navigate('/');
  };

  return (
    <Popover>
      <PopoverTrigger>
        <img
          src={avatarUrl || defaultAvatar}
          alt={`${fullName}'s avatar`}
          className="size-9 rounded-full transition hover:cursor-pointer hover:opacity-75"
        />
      </PopoverTrigger>
      <PopoverContent>
        <div className="flex items-center gap-x-2">
          <img
            src={avatarUrl || defaultAvatar}
            alt={`${fullName}'s avatar`}
            className="size-11 rounded-full object-cover"
          />
          <div className="flex h-full flex-col text-ellipsis leading-none">
            <p className="w-44 overflow-hidden text-ellipsis whitespace-nowrap font-bold">
              {fullName}
            </p>
            <p className="text-xs">{email}</p>
          </div>
        </div>
        <div className="mt-4">
          <Button variant={'ghost'} type="button" className="w-full p-0">
            <div className="flex w-full items-center gap-x-1 text-slate-700">
              <Settings size={16} />
              <span>Manage Account</span>
            </div>
          </Button>
          <Button
            variant={'ghost'}
            type="button"
            className="w-full p-0"
            onClick={handleLogout}
          >
            <div className="flex w-full items-center gap-x-1 text-slate-700">
              <LogOut size={16} />
              <span>Sign out</span>
            </div>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default Avatar;
