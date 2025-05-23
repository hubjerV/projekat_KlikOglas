'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

type User = {
  username: string;
  email?: string; // Dodaj email kao opcioni
};

type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
};

const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
});

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token'); 
    console.log("Access token:", token); // test

    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        console.log("Decoded token:", decoded);
        setUser({ 
          username: decoded.sub, 
          email: decoded.email 
        });
      } catch (err) {
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {!loading && children}
    </UserContext.Provider>
  );
};
