'use client';
import { useEffect, useState } from 'react';
import { footballApi } from '@/app/lib/api';
import { useApp } from './context/AppContext';
import Sidebar from './components/Sidebar';
import MatchCard from './components/MatchCard';

export default function Home() {
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'live' | 'today'>('live');
  const { t } = useApp();

  const fetchMatches = async (type: 'live' | 'today') => {
    setLoading(true);
    try {
      const res = type === 'live' ? await footballApi.getLive() : await footballApi.getToday();
      setMatches(res.data.data || []);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches(view);
  }, [view]);

  return (
    <div className="flex h-screen bg-[#0a0e1a] overflow-hidden">
      {/* 1. COLUMNA IZQUIERDA: Menu de Ligas y Países */}
      <Sidebar />

      {/* 2. COLUMNA CENTRAL: Resultados */}
      <main className="flex-1 overflow-y-auto border-r border-gray-800">
        <header className="sticky top-0 z-10 bg-[#0a0e1a]/80 backdrop-blur-md p-4 border-b border-gray-800">
          <div className="flex gap-6">
            <button 
              onClick={() => setView('live')}
              className={`text-xs font-black uppercase tracking-tighter transition ${view === 'live' ? 'text-[#00ff87] border-b-2 border-[#00ff87]' : 'text-gray-500'}`}
            >
              {t('live')}
            </button>
            <button 
              onClick={() => setView('today')}
              className={`text-xs font-black uppercase tracking-tighter transition ${view === 'today' ? 'text-[#00ff87] border-b-2 border-[#00ff87]' : 'text-gray-500'}`}
            >
              {t('today')}
            </button>
          </div>
        </header>

        <div className="p-4 space-y-3">
          {loading ? (
            <p className="text-center text-gray-500 animate-pulse mt-10">Cargando partidos...</p>
          ) : matches.length > 0 ? (
            matches.map((m: any) => (
              <MatchCard 
                key={m.fixture.id}
                id={m.fixture.id}
                homeTeam={m.teams.home}
                awayTeam={m.teams.away}
                goals={m.goals}
                status={m.fixture.status.short}
                league={m.league.name}
                time={m.fixture.status.elapsed}
              />
            ))
          ) : (
            <p className="text-center text-gray-500 mt-10">No hay partidos en este momento.</p>
          )}
        </div>
      </main>

      {/* 3. COLUMNA DERECHA: Favoritos y Cuotas */}
      <aside className="w-80 hidden lg:block p-4 overflow-y-auto">
        <div className="bg-[#1a2235] rounded-xl p-4 border border-gray-800">
          <h3 className="text-[#00ff87] text-xs font-bold uppercase mb-4">Mis Ligas Favoritas ⭐</h3>
          <p className="text-gray-500 text-[10px]">Selecciona ligas en el menú lateral para verlas aquí.</p>
        </div>
      </aside>
    </div>
  );
}