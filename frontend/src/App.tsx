import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthGate from './components/AuthGate';
import { useEffect, useState } from 'react';
import { getCsrf, getCurrentUser } from './services/authService';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import useAuthStore from './stores/authStore';
import AuthPage from './pages/AuthPage';
import Login from './components/Login';
import SignUp from './components/Signup';
import VerifyEmailPage from './pages/VerifyEmailPage';

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
    <BrowserRouter>
      <Routes>
        <Route element={<AuthGate anonymous />}>
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
    </BrowserRouter>
  );
};

const SignedIn = () => {
  const [isLoading, setIsLoading] = useState(true);
  const user = useAuthStore((state) => state.user!);

  useEffect(() => {
    const getToken = async () => {
      await getCsrf();
      setIsLoading(false);
    };

    getToken();
  }, []);

  if (isLoading) return null;
  return (
    <div className="h-screen">
      <Navbar />
      <div className="mx-auto h-full w-full px-1 pt-14 xl:max-w-screen-2xl">
        <div className="flex h-full">
          <Sidebar />
          <main>
            Hello <span className="text-green-500">{user.fullName}</span>
          </main>
        </div>
      </div>
    </div>
  );
};

export default App;
