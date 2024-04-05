import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_protected/workspaces/$workspaceId/')({
  component: () => <div>Hello /workspaces/$workspaceId/!</div>,
});
