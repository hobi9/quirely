import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

import { workspacesQueryOption } from '@/hooks/useWorskpaces';
import AuthenticatedNavbar from '@/components/AuthenticatedNavbar';

const paramSchema = z.object({
  boardId: z.coerce.number(),
});

export const Route = createFileRoute('/_protected/boards/$boardId')({
  params: {
    parse: paramSchema.parse,
  },
  loader: async ({ context: { queryClient } }) => {
    //TODO: add specific query for the board using params
    await queryClient.ensureQueryData(workspacesQueryOption);
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="h-screen">
      <AuthenticatedNavbar />
      <main className="mx-auto h-full w-full px-4 pt-24 xl:max-w-screen-2xl"></main>
    </div>
  );
}
