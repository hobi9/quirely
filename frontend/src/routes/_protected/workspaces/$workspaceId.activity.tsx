import Activity from '@/components/Activity';
import WorkspaceImage from '@/components/ui/image/workspace-image';
import { ScrollArea } from '@/components/ui/scroll-area';
import useWorkspace from '@/hooks/useWorkspace';
import useWorkspaceActivities, {
  workspaceActivitiesQueryOptions,
} from '@/hooks/useWorkspaceActivities';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute(
  '/_protected/workspaces/$workspaceId/activity',
)({
  component: ActivityPage,
  loader: async ({ params, context: { queryClient } }) => {
    const { workspaceId } = params;
    await queryClient.ensureQueryData(
      workspaceActivitiesQueryOptions(workspaceId),
    );
  },
});

function ActivityPage() {
  const { workspaceId } = Route.useParams();
  const activities = useWorkspaceActivities(workspaceId);
  const workspace = useWorkspace();

  return (
    <div className="size-full overflow-hidden">
      <div className="flex items-center gap-x-4">
        <WorkspaceImage workspace={workspace} className="size-[60px]" />
        <div>
          <p className="text-xl font-semibold">{workspace.name}</p>
          <p className="text-muted-foreground text-sm">
            {workspace.description}
          </p>
        </div>
      </div>
      <hr className="my-2" />
      {activities.length != 0 ? (
        <ScrollArea className="h-full">
          <Activity items={activities} />
        </ScrollArea>
      ) : (
        <p className="text-muted-foreground text-center text-xs">
          No activity found inside this workspace
        </p>
      )}
    </div>
  );
}
