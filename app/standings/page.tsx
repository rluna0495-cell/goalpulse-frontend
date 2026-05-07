'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { footballApi } from '@/app/lib/api';
import Navbar from '@/app/components/Navbar';

function StandingsContent() {
  const searchParams = useSearchParams();
  const leagueId = searchParams.get('league') || '39'; // Premier por defecto
  const [standings, setStandings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStandings = async () => {
      try {
        setLoading(true);
        const res = await footballApi.getStandings(Number(leagueId));
        setStandings(res.data.data[0]?.league?.standings[0] || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStandings();
  }, [leagueId]);

  return (
    <div className="max-w-5xl mx-auto p-4 mt-6">
      <h1 className="text-white text-2xl font-bold mb-6">Tabla de Posiciones</h1>
      {loading ? (
        <div className="text-white animate-pulse">Cargando tabla...</div>
      ) : (
        <div className="bg-[#1a2235] rounded-xl border border-[#1f2937] overflow-hidden">
          <table className="w-full text-left text-[#9ca3af]">
            <thead className="bg-[#0f172a] text-xs uppercase font-bold text-[#00ff87]">
              <tr>
                <th className="p-4">Pos</th>
                <th className="p-4">Equipo</th>
                <th className="p-4 text-center">PJ</th>
                <th className="p-4 text-center">G</th>
                <th className="p-4 text-center">E</th>
                <th className="p-4 text-center">P</th>
                <th className="p-4 text-center text-white">PTS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1f2937]">
              {standings.map((team: any) => (
                <tr key={team.team.id} className="hover:bg-[#242f47] transition-colors">
                  <td className="p-4 font-bold">{team.rank}</td>
                  <td className="p-4 flex items-center gap-3">
                    <img src={team.team.logo} className="w-6 h-6 object-contain" alt="" />
                    <span className="text-white font-medium">{team.team.name}</span>
                  </td>
                  <td className="p-4 text-center">{team.all.played}</td>
                  <td className="p-4 text-center">{team.all.win}</td>
                  <td className="p-4 text-center">{team.all.draw}</td>
                  <td className="p-4 text-center">{team.all.lose}</td>
                  <td className="p-4 text-center text-[#00ff87] font-black">{team.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function StandingsPage() {
  return (
    <main className="min-h-screen bg-[#0a0e1a]">
      <Navbar />
      <Suspense fallback={<div className="text-white p-10 text-center">Cargando aplicación...</div>}>
        <StandingsContent />
      </Suspense>
    </main>
  );
}