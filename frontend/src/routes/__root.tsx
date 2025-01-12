import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/toaster';
import { queryClient } from '@/lib/queryClient';
import {
  Link,
  Outlet,
  createRootRouteWithContext,
} from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { Home } from 'lucide-react';

export interface RouterContext {
  queryClient: typeof queryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <>
      <Outlet />
      <Toaster />
      <TanStackRouterDevtools />
    </>
  ),
  notFoundComponent: NotFoundComponent,
});

function NotFoundComponent() {
  return (
    <div className="flex h-screen items-center justify-center px-2">
      <main className="space-y-4 text-center">
        <h1 className="animate-bounce text-8xl font-bold">404</h1>
        <h2 className="text-2xl font-semibold">Page not found</h2>
        <p className="max-w-md text-muted-foreground">
          Sorry, we couldn't find the page you're looking for. Please check the
          URL or return home.
        </p>
        <Button asChild>
          <Link to="/" replace className="gap-2">
            <Home className="size-4" />
            <span>Back to Home</span>
          </Link>
        </Button>
      </main>
    </div>
  );
}
