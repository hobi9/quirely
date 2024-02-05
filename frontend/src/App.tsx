import { Routes, Route, Navigate } from 'react-router-dom';
import AuthGate from './components/AuthGate';
import { useEffect, useState } from 'react';
import { getCsrf, getCurrentUser } from './services/authService';
import useAuthStore from './stores/authStore';
import AuthPage from './pages/AuthPage';
import Login from './components/Login';
import SignUp from './components/Signup';
import VerifyEmailPage from './pages/VerifyEmailPage';
import SelectWorkspacePage from './pages/SelectWorkspace';
import WorkspacePage from './pages/WorkspacePage';
import Layout from './components/Layout';
import SettingsPage from './pages/SettingsPage';
import BoardsPage from './pages/BoardsPage';
import ActivityPage from './pages/ActivityPage';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    const initializeUser = async () => {
      const fetchedUser = await getCurrentUser();
      setUser(fetchedUser);
      setIsLoading(false);
    };
    initializeUser();
  }, [setUser]);

  if (isLoading) return null;

  return (
    <Routes>
      <Route element={<AuthGate notRequired />}>
        <Route path="auth" element={<AuthPage />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<SignUp />} />
          <Route index element={<Navigate replace to="login" />} />
        </Route>
        <Route path="verify-email/:id/:token" element={<VerifyEmailPage />} />
      </Route>
      <Route element={<AuthGate required />}>
        <Route path="*" element={<SignedIn />} />
      </Route>
    </Routes>
  );
};

const SignedIn = () => {
  const [isLoading, setIsLoading] = useState(true);
  //const user = useAuthStore((state) => state.user!);

  useEffect(() => {
    const getToken = async () => {
      await getCsrf();
      setIsLoading(false);
    };

    getToken();
  }, []);

  if (isLoading) return null;

  return (
    <Routes>
      <Route path="select-workspace" element={<SelectWorkspacePage />} />
      <Route path="workspace" element={<Layout />}>
        <Route path=":workspaceId" element={<WorkspacePage />}>
          <Route path="" element={<BoardsPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="activity" element={<ActivityPage />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default App;
