import useAuthStore from '../stores/authStore';
import defaultAvatar from '../assets/defaultAvatar.svg';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Settings, LogOut } from 'lucide-react';

const Avatar = () => {
  const { fullName, avatarUrl, email } = useAuthStore((state) => state.user!);
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
            className="size-11 rounded-full"
          />
          <div className="flex h-full flex-col text-ellipsis leading-none">
            <p className="w-44 overflow-hidden text-ellipsis whitespace-nowrap font-bold">
              {fullName}
            </p>
            <p className="text-xs">{email}</p>
          </div>
        </div>
        <div className="mt-4">
          <div className="rounded-sm py-2 hover:bg-slate-100">
            <div className="flex items-center gap-x-1 text-slate-700">
              <Settings size={16} />
              <span>Manage Account</span>
            </div>
          </div>
          <div className="rounded-sm py-2 hover:bg-slate-100">
            <div className="flex items-center gap-x-1 text-slate-700">
              <LogOut size={16} />
              <span>Sign out</span>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default Avatar;
