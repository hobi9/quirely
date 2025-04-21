import { Activity } from '@/types/misc';
import AvatarImage from './ui/image/avatar-image';
import { format } from 'date-fns';

type Props = {
  activity: Activity;
};

const ActivityItem = ({ activity }: Props) => {
  const generateLogMessage = (activity: Activity) => {
    const { action, entityType, entityTitle } = activity;

    switch (action) {
      case 'CREATE':
        return `created ${entityType.toLocaleLowerCase()} "${entityTitle}"`;
      case 'UPDATE':
        return `updated ${entityType.toLocaleLowerCase()} "${entityTitle}"`;
      case 'DELETE':
        return `deleted ${entityType.toLocaleLowerCase()} "${entityTitle}"`;
      default:
        return `performed an unknown action on ${entityType.toLocaleLowerCase()} "${entityTitle}"`;
    }
  };

  return (
    <li className="flex items-center gap-x-2">
      <AvatarImage user={activity.user} className="size-8" />
      <div className="flex flex-col space-y-0.5">
        <p className="text-muted-foreground text-sm">
          <span className="font-semibold text-neutral-700 lowercase">
            {activity.user.fullName}
          </span>{' '}
          {generateLogMessage(activity)}
        </p>
        <p className="text-muted-foreground text-xs">
          {format(new Date(activity.createdAt), "MMM d, yyyy 'at' h:mm a")}
        </p>
      </div>
    </li>
  );
};
export default ActivityItem;
