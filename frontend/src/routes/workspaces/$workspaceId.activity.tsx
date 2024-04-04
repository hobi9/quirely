import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/workspaces/$workspaceId/activity')({
  component: () => <div>Hello /workspaces/$workspaceId/activity!</div>,
});
