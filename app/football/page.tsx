'use client';
import { useEffect, useState } from 'react';
import { footballApi } from '@/app/lib/api';
import Navbar from '@/app/components/Navbar';
import MatchCard from '@/app/components/MatchCard';

export default function Home() {
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await footballApi.getLive();
        setMatches(res.data.data || []);
      } catch (err) {
        console.error("Error cargando partidos:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, []);

  return (
    <main className="min-h-screen bg-[#0a0e1a]">
      <Navbar />
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-[#00ff87] text-2xl font-black mb-6 uppercase tracking-tighter">
          ⚡ Partidos en Vivo
        </h1>
        
        {loading ? (
          <div className="text-white text-center p-20 animate-pulse">Cargando Marcadores...</div>
        ) : matches.length > 0 ? (
          <div className="grid gap-4">
            {matches.map((m: any) => (
              <MatchCard 
                key={m.fixture.id} 
                id={m.fixture.id}
                homeTeam={m.teams.home}
                awayTeam={m.teams.away}
                goals={m.goals}
                status={m.fixture.status.short}
                league={m.league.name}
                time={m.fixture.status.elapsed + "'"}
              />
            ))}
          </div>
        ) : (
          <div className="text-white text-center p-20 bg-[#1a2235] rounded-xl">
            No hay partidos en vivo en este momento.
          </div>
        )}
      </div>
    </main>
  );
}