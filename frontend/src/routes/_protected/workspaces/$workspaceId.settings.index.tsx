import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute(
  '/_protected/workspaces/$workspaceId/settings/',
)({
  component: () => <div>Hello /workspaces/$workspaceId/settings/!</div>,
});
