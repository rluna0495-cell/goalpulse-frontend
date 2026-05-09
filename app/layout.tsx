import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AppProvider } from "./context/AppContext";
import Navbar from './components/Navbar';

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
      <body className={`${inter.className} antialiased`}>
        <AppProvider>
          <div className="flex flex-col h-screen w-full overflow-hidden">
            <Navbar />
            <div className="flex-1 w-full overflow-hidden">
              {children}
            </div>
          </div>
        </AppProvider>
      </body>
    </html>
  );
}