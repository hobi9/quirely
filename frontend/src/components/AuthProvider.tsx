import { createContext, ReactNode, useState, useEffect } from 'react';
import { User } from '../types/user';
import { getCurrentUser } from '../services/authService';

type AuthContext = {
  user: User | null;
  setUser: (user: User) => void;
};

type Props = {
  children: ReactNode;
};

export const AuthContext = createContext<AuthContext | null>(null);

export const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeUser = async () => {
      try {
        const fetchedUser = await getCurrentUser();
        setUser(fetchedUser);
      } catch (error) {
        // TODO: handle it better
      } finally {
        setIsLoading(false);
      }
    };

    initializeUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {isLoading ? <div></div> : children}
    </AuthContext.Provider>
  );
};
