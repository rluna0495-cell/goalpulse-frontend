'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { footballApi } from '@/app/lib/api';
import Navbar from '@/app/components/Navbar';

export default function MatchDetail() {
  const { id } = useParams();
  const [match, setMatch] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await footballApi.getMatchDetails(id as string);
        // API-Football devuelve los datos en res.data.data[0]
        setMatch(res.data.data[0] || res.data[0]);
      } catch (err) {
        console.error("Error cargando detalles:", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchDetails();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-[#0a0e1a] text-white flex items-center justify-center">
      <div className="text-xl font-bold animate-pulse">Sincronizando estadísticas...</div>
    </div>
  );

  if (!match) return (
    <div className="min-h-screen bg-[#0a0e1a] text-white flex items-center justify-center">
      <div className="text-xl">No se encontraron datos de este partido.</div>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#0a0e1a] pb-10">
      <Navbar />
      <div className="max-w-4xl mx-auto p-4 mt-8">
        
        {/* Cabecera de Liga */}
        <div className="flex items-center gap-3 mb-6 bg-[#1a2235] p-3 rounded-lg border border-[#1f2937]">
          <img src={match.league.logo} className="w-6 h-6 object-contain" alt="" />
          <span className="text-white font-semibold">{match.league.name}</span>
          <span className="text-[#9ca3af]">| {match.league.round}</span>
        </div>

        {/* Marcador Principal */}
        <div className="bg-gradient-to-b from-[#1a2235] to-[#0a0e1a] rounded-3xl p-10 flex justify-between items-center border border-[#1f2937] shadow-2xl">
          <div className="text-center flex-1">
            <img src={match.teams.home.logo} className="w-24 h-24 mx-auto mb-4 object-contain" alt="" />
            <h2 className="text-xl font-bold text-white">{match.teams.home.name}</h2>
          </div>

          <div className="text-center px-8">
            <div className="text-6xl font-black text-[#00ff87] tracking-tighter">
              {match.goals.home} - {match.goals.away}
            </div>
            <div className="inline-block px-4 py-1 bg-[#ff4d4d] text-white text-xs font-bold rounded-full mt-4 animate-pulse">
              {match.fixture.status.short === 'FT' ? 'FINALIZADO' : `${match.fixture.status.elapsed}'`}
            </div>
          </div>

          <div className="text-center flex-1">
            <img src={match.teams.away.logo} className="w-24 h-24 mx-auto mb-4 object-contain" alt="" />
            <h2 className="text-xl font-bold text-white">{match.teams.away.name}</h2>
          </div>
        </div>

        {/* Información Extra */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
           <div className="bg-[#1a2235] p-6 rounded-2xl border border-[#1f2937]">
              <h3 className="text-[#00ff87] font-bold mb-4 uppercase text-sm tracking-wider">Estadio</h3>
              <p className="text-white text-lg">{match.fixture.venue.name}</p>
              <p className="text-[#9ca3af]">{match.fixture.venue.city}</p>
           </div>
           <div className="bg-[#1a2235] p-6 rounded-2xl border border-[#1f2937]">
              <h3 className="text-[#00ff87] font-bold mb-4 uppercase text-sm tracking-wider">Árbitro</h3>
              <p className="text-white text-lg">{match.fixture.referee || 'No asignado'}</p>
           </div>
        </div>
      </div>
    </main>
  );
}