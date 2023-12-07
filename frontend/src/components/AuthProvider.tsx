import { createContext, ReactNode, useState } from 'react';
import { User } from '../types/user';

type AuthContext = {
  user: User | null;
  setUser: (user: User) => void;
};

type Props = {
  children: ReactNode;
};

export const AuthContext = createContext<AuthContext | null>(null);

export const AuthContextProvider = ({ children }: Props) => {
  const [user, setUser] = useState<User | null>(() => {
    const userProfle = localStorage.getItem('user');
    if (userProfle) {
      return JSON.parse(userProfle) as User;
    }
    return null;
  });

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
