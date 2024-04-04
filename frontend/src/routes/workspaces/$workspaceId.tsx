import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { workspaceQueryOptions } from '@/hooks/useWorkspace';
import { workspacesQueryOption } from '@/hooks/useWorskpaces';
import { Outlet, createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

export const Route = createFileRoute('/workspaces/$workspaceId')({
  parseParams: (params) => ({
    workspaceId: z.number().int().parse(Number(params.workspaceId)),
  }),
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
      <Navbar />
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
