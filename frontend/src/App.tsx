import { useAuth } from './hooks/auth';
import { routeTree } from './routeTree.gen';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query';

const router = createRouter({
  routeTree,
  context: { queryClient: undefined! },
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const App = () => {
  const queryClient = useQueryClient();
  const { isPending } = useAuth();

  if (isPending) return null;

  return <RouterProvider router={router} context={{ queryClient }} />;
};

export default App;
