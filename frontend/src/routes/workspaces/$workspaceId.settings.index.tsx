import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/workspaces/$workspaceId/settings/')({
  component: () => <div>Hello /workspaces/$workspaceId/settings/!</div>
})