'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

const AppContext = createContext<any>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState('es'); // 'es' o 'en'
  const [user, setUser] = useState(null);

  // Diccionario simple para empezar
  const translations: any = {
    es: { live: "En Vivo", today: "Hoy", lineups: "Alineaciones", stats: "Estadísticas" },
    en: { live: "Live", today: "Today", lineups: "Lineups", stats: "Stats" }
  };

  const t = (key: string) => translations[language][key] || key;

  return (
    <AppContext.Provider value={{ language, setLanguage, user, setUser, t }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);