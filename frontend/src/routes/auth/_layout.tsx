import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Link,
  Outlet,
  createFileRoute,
  useRouterState,
} from '@tanstack/react-router';
import logo from '../../assets/logo.svg';

export const Route = createFileRoute('/auth/_layout')({
  component: AuthLayout,
});

function AuthLayout() {
  const { location } = useRouterState();
  const activeTab = location.pathname.split('/').at(-1)!;

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[450px] flex-col justify-center overflow-x-hidden p-2">
      <main className="flex h-full flex-col items-center justify-center">
        <div className="mb-4 flex items-center justify-center gap-x-2 transition hover:cursor-pointer hover:opacity-75">
          <img src={logo} className="size-16" />
          <h1 className="font-logo text-5xl">Quirely</h1>
        </div>
        <Tabs className="w-full" value={activeTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login" asChild>
              <Link to={'/auth/login'}>Sign In</Link>
            </TabsTrigger>
            <TabsTrigger value="register" asChild>
              <Link to={'/auth/register'}>Sign Up</Link>
            </TabsTrigger>
          </TabsList>
          <TabsContent value={activeTab}>
            <Outlet />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
