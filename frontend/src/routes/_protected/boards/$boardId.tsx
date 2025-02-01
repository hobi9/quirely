import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

import { workspacesQueryOption } from '@/hooks/useWorskpaces';
import useBoard, { boardQueryOptions } from '@/hooks/useBoard';
import BoardNavbar from './-(components)/BoardNavbar';
import ListContainer from './-(components)/ListContainer';
import useBoardLists, { boardListsQueryOptions } from '@/hooks/useBoardLists';

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
      queryClient.ensureQueryData(boardListsQueryOptions(boardId)),
    ]);
  },
  component: RouteComponent,
});

function RouteComponent() {
  const board = useBoard();
  const lists = useBoardLists();

  return (
    <div
      style={{ backgroundImage: `url(${board.fullUrl})` }}
      className="relative h-full max-w-full overflow-hidden bg-cover bg-center bg-no-repeat"
    >
      <BoardNavbar board={board} />
      <main className="mx-auto h-full w-full px-4 pt-32">
        <div className="h-full w-full overflow-x-auto">
          <ListContainer lists={lists} />
        </div>
      </main>
    </div>
  );
}
