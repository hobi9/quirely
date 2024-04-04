import { useAuth } from './hooks/auth';
import { routeTree } from './routeTree.gen';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { queryClient } from './lib/queryClient';

const router = createRouter({
  routeTree,
  context: { queryClient, user: null },
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const App = () => {
  const { isLoading, data: user } = useAuth();

  if (isLoading) return null;

  return <RouterProvider router={router} context={{ queryClient, user }} />;
};

export default App;
