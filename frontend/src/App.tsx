import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/login';
import SignUp from './pages/signup';
import AuthGate from './components/AuthGate';
import { useEffect } from 'react';
import { getCsrf } from './services/authService';
import { AuthProvider } from './components/AuthProvider';

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/login"
            element={
              <AuthGate notRequired>
                <Login />
              </AuthGate>
            }
          />
          <Route
            path="/register"
            element={
              <AuthGate notRequired>
                <SignUp />
              </AuthGate>
            }
          />
          <Route
            path="/*"
            element={
              <AuthGate required>
                <SignedIn />
              </AuthGate>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

const SignedIn = () => {
  useEffect(() => {
    getCsrf();
  }, []);
  return <div>Hello</div>;
};

export default App;
