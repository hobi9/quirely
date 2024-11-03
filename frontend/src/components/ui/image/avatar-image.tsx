import { User } from '@/types/user';
import defaultAvatar from '../../../assets/defaultAvatar.svg';
import ImageWithDefault from './image-with-default';
import { cn } from '@/lib/utils';

type Props = {
  user: User;
  className?: string;
};

const AvatarImage = ({ user, className }: Props) => {
  return (
    <ImageWithDefault
      src={user.avatarUrl}
      defaultSrc={defaultAvatar}
      alt={`${user.fullName}'s avatar`}
      className={cn('rounded-full object-cover', className)}
    />
  );
};
export default AvatarImage;
