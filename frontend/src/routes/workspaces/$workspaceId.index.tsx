import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/workspaces/$workspaceId/')({
  component: () => <div>Hello /workspaces/$workspaceId/!</div>
})