import AuthenticatedNavbar from '@/components/AuthenticatedNavbar';
import Sidebar from '@/components/Sidebar';
import { workspaceQueryOptions } from '@/hooks/useWorkspace';
import { workspacesQueryOption } from '@/hooks/useWorskpaces';
import { Outlet, createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

const paramSchema = z.object({
  workspaceId: z.coerce.number(),
});

export const Route = createFileRoute('/_protected/workspaces/$workspaceId')({
  params: {
    parse: paramSchema.parse,
  },
  loader: async ({ params, context: { queryClient } }) => {
    const { workspaceId } = params;

    await Promise.all([
      queryClient.ensureQueryData(workspaceQueryOptions(workspaceId)),
      queryClient.ensureQueryData(workspacesQueryOption),
    ]);
  },
  component: WorkspacePage,
});

function WorkspacePage() {
  return (
    <div className="h-screen">
      <AuthenticatedNavbar />
      <main className="mx-auto h-full w-full px-4 pt-24 xl:max-w-screen-2xl">
        <div className="flex h-full gap-x-4">
          <div className="hidden h-full w-64 shrink-0 md:block">
            <Sidebar />
          </div>
          <div className="w-full">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
