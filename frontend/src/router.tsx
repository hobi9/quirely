import { Navigate, createBrowserRouter } from 'react-router-dom';
import AuthGate from './components/AuthGate';
import Login from './components/Login';
import SignUp from './components/Signup';
import VerifyEmailPage from './pages/VerifyEmailPage';
import SelectWorkspacePage from './pages/SelectWorkspace';
import Layout from './components/Layout';
import BoardsPage from './pages/BoardsPage';
import SettingsPage from './pages/WorkspaceSettings';
import ActivityPage from './pages/ActivityPage';
import AuthPage from './pages/AuthPage';
import { queryClient } from './lib/queryClient';

export const router = createBrowserRouter([
  {
    element: <AuthGate notRequired />,
    children: [
      {
        index: true,
        element: <div>HomePage</div>,
      },
      {
        path: 'auth',
        element: <AuthPage />,
        children: [
          {
            index: true,
            element: <Navigate replace to="login" />,
          },
          {
            path: 'login',
            element: <Login />,
          },
          {
            path: 'register',
            element: <SignUp />,
          },
          {
            path: '*',
            element: <Navigate replace to="login" />,
          },
        ],
      },
    ],
  },
  {
    path: 'verify-email/:token',
    element: <VerifyEmailPage />,
  },
  {
    element: <AuthGate required />,
    children: [
      {
        path: 'select-workspace',
        element: <SelectWorkspacePage />,
        loader: SelectWorkspacePage.loader(queryClient),
      },
      {
        path: 'workspace/:workspaceId',
        element: <Layout />,
        loader: Layout.loader(queryClient),
        id: 'workspace-route',
        children: [
          {
            index: true,
            element: <BoardsPage />,
          },
          {
            path: 'settings',
            element: <SettingsPage />,
          },
          {
            path: 'activity',
            element: <ActivityPage />,
          },
        ],
      },
    ],
  },
]);
