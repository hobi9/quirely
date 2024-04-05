import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute(
  '/_protected/workspaces/$workspaceId/settings/workspace-settings',
)({
  component: () => (
    <div>Hello /workspaces/$workspaceId/settings/workspace-settings!</div>
  ),
});
