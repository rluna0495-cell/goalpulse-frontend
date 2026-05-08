'use client';
import { createContext, useState, useContext } from 'react';

const UserContext = createContext<any>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState(null); // Aquí se guardará el usuario al registrarse
  const [language, setLanguage] = useState('es'); // Idioma por defecto: Español

  return (
    <UserContext.Provider value={{ user, setUser, language, setLanguage }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);