import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

const paramSchema = z.object({
  boardId: z.coerce.number(),
});

export const Route = createFileRoute('/_protected/boards/$boardId')({
  params: {
    parse: paramSchema.parse,
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { boardId } = Route.useParams();
  return <div>Hello {boardId}!</div>;
}
