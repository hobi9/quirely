import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/login';
import SignUp from './pages/signup';
import AuthGate from './components/AuthGate';
import { useContext, useEffect, useState } from 'react';
import { getCsrf } from './services/authService';
import { AuthContext, AuthProvider } from './components/AuthProvider';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AuthGate anonymous />}>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<SignUp />} />
          </Route>
          <Route element={<AuthGate required />}>
            <Route path="/" element={<SignedIn />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

const SignedIn = () => {
  const [isLoading, setIsLoading] = useState(true);
  const auth = useContext(AuthContext);

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
      <main className="flex px-2 mx-auto pt-14 h-full flex-grow">
        <Sidebar />
        <div>
          Hello <span className="text-green-500">{auth!.user?.fullName}</span>
        </div>
      </main>
    </div>
  );
};

export default App;
