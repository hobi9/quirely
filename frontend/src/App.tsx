import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/login';
import SignUp from './pages/signup';
import AuthGate from './components/AuthGate';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path='/signin'
          element={
            <AuthGate notRequired>
              <Login />
            </AuthGate>
          }
        />
        <Route
          path='/signup'
          element={
            <AuthGate notRequired>
              <SignUp />
            </AuthGate>
          }
        />
        <Route
          path='/'
          element={
            <AuthGate required>
              <HomePage />
            </AuthGate>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

const HomePage = () => {
  return <div>Hello</div>;
};

export default App;
