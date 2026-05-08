import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AppProvider } from "./context/AppContext"; // Importamos el cerebro de la app

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'GoalPulse - Fútbol en Tiempo Real',
  description: 'Resultados de fútbol en vivo de todas las ligas del mundo',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-[#0a0e1a] text-white antialiased`}>
        {/* Aquí está la clave: AppProvider envuelve a {children}.
            Sin esto, la opción de cambiar idioma o el registro de usuario no funcionaría.
        */}
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}