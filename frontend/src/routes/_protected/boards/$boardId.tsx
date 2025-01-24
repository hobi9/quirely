import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

import { workspacesQueryOption } from '@/hooks/useWorskpaces';
import useBoard, { boardQueryOptions } from '@/hooks/useBoard';
import BoardNavbar from './-(components)/BoardNavbar';

const paramSchema = z.object({
  boardId: z.coerce.number(),
});

export const Route = createFileRoute('/_protected/boards/$boardId')({
  params: {
    parse: paramSchema.parse,
  },
  loader: async ({ context: { queryClient }, params: { boardId } }) => {
    await Promise.all([
      queryClient.ensureQueryData(workspacesQueryOption),
      queryClient.ensureQueryData(boardQueryOptions(boardId)),
    ]);
  },
  component: RouteComponent,
});

function RouteComponent() {
  const board = useBoard();
  return (
    <div
      style={{ backgroundImage: `url(${board.fullUrl})` }}
      className="relative h-full max-w-full overflow-hidden bg-cover bg-center bg-no-repeat"
    >
      <BoardNavbar board={board} />
      <main className="mx-auto h-full w-full px-4 pt-24 xl:max-w-(--breakpoint-2xl)"></main>
    </div>
  );
}
