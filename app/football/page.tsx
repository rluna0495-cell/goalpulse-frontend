'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { footballApi } from '@/app/lib/api';
import Navbar from '@/app/components/Navbar';
import MatchCard from '@/app/components/MatchCard';

function LeagueContent() {
  const searchParams = useSearchParams();
  const leagueId = searchParams.get('league');
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!leagueId) return;
    const load = async () => {
      setLoading(true);
      try {
        const res = await footballApi.getMatchesByLeague(Number(leagueId));
        setMatches(res.data.data || []);
      } catch (e) { console.error(e); }
      setLoading(false);
    };
    load();
  }, [leagueId]);

  if (!leagueId) return <div className="text-white p-10">Selecciona una liga.</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      {loading ? (
        <div className="text-[#00ff87] animate-bounce p-10 text-center">Buscando partidos...</div>
      ) : matches.length > 0 ? (
        <div className="grid gap-4">
          {matches.map((m) => (
            <MatchCard key={m.fixture.id} id={m.fixture.id} homeTeam={m.teams.home} awayTeam={m.teams.away} goals={m.goals} status={m.fixture.status.short} league={m.league.name} time={m.fixture.status.elapsed + "'"} />
          ))}
        </div>
      ) : (
        <div className="text-white text-center p-10 bg-[#1a2235] rounded-xl">No hay partidos hoy en esta liga.</div>
      )}
    </div>
  );
}

export default function FootballPage() {
  return (
    <main className="min-h-screen bg-[#0a0e1a]">
      <Navbar />
      <Suspense fallback={null}><LeagueContent /></Suspense>
    </main>
  );
}