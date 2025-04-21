import ActivityItem from '@/components/ActivityItem';
import { Skeleton } from '@/components/ui/skeleton';
import { Activity as ActivityType } from '@/types/misc';
import { ActivityIcon } from 'lucide-react';

type Props = {
  items: ActivityType[];
};

const Activity = ({ items }: Props) => {
  return (
    <div className="flex w-full items-start gap-x-3">
      <ActivityIcon className="mt-0.5 size-5 text-neutral-700" />
      <div className="w-full">
        <span className="mb-2 font-semibold text-neutral-700">Activity</span>
        <ol className="mt-2 space-y-4">
          {items.map((item) => (
            <ActivityItem key={item.id} activity={item} />
          ))}
        </ol>
      </div>
    </div>
  );
};

Activity.Skeleton = () => {
  return (
    <div className="flex w-full items-start gap-x-3">
      <Skeleton className="size-6 bg-neutral-200" />
      <div className="w-full">
        <Skeleton className="mb-2 h-6 w-24 bg-neutral-200" />
        <Skeleton className="h-10 w-full bg-neutral-200" />
      </div>
    </div>
  );
};

export default Activity;
