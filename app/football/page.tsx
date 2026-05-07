'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { footballApi } from '@/app/lib/api';
import Navbar from '@/app/components/Navbar';
import MatchCard from '@/app/components/MatchCard';

function FootballContent() {
  const searchParams = useSearchParams();
  const leagueId = searchParams.get('league');
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeagueData = async () => {
      if (!leagueId) return;
      try {
        setLoading(true);
        const res = await footballApi.getMatchesByLeague(Number(leagueId));
        setMatches(res.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeagueData();
  }, [leagueId]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-white text-2xl font-bold mb-6 uppercase tracking-widest">Partidos de la Liga</h1>
      {loading ? (
        <p className="text-[#9ca3af]">Cargando partidos...</p>
      ) : matches.length === 0 ? (
        <p className="text-[#9ca3af]">No hay partidos programados para hoy en esta liga.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {matches.map((match: any) => (
            <MatchCard
              key={match.fixture.id}
              id={match.fixture.id}
              homeTeam={match.teams.home}
              awayTeam={match.teams.away}
              goals={match.goals}
              status={match.fixture.status.short}
              league={match.league.name}
              time={new Date(match.fixture.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function FootballPage() {
  return (
    <main className="min-h-screen bg-[#0a0e1a]">
      <Navbar />
      <Suspense fallback={<div className="text-white p-10">Cargando...</div>}>
        <FootballContent />
      </Suspense>
    </main>
  );
}