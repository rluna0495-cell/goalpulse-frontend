'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { footballApi } from '@/app/lib/api';
import Navbar from '@/app/components/Navbar';

export default function MatchDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [match, setMatch] = useState<any>(null);
  const [stats, setStats] = useState<any[]>([]);
  const [lineups, setLineups] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('resumen');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [mRes, sRes, lRes] = await Promise.all([
          footballApi.getMatchDetails(id as string),
          footballApi.getMatchStats(id as string),
          footballApi.getMatchLineups(id as string)
        ]);
        setMatch(mRes.data.data[0]);
        setStats(sRes.data.data || []);
        setLineups(lRes.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchAllData();
  }, [id]);

  if (loading) return <div className="min-h-screen bg-[#0a0e1a] text-white p-10 text-center">Cargando...</div>;
  if (!match) return <div className="min-h-screen bg-[#0a0e1a] text-white p-10 text-center">Partido no encontrado.</div>;

  return (
    <main className="min-h-screen bg-[#0a0e1a] text-white">
      <Navbar />
      <div className="max-w-4xl mx-auto p-4">
        <button onClick={() => router.push('/')} className="mb-6 text-[#9ca3af] hover:text-[#00ff87] flex items-center gap-2">
          ← Volver al Inicio
        </button>

        {/* Marcador */}
        <div className="bg-[#1a2235] rounded-2xl p-8 border border-[#2d3748] mb-6 shadow-xl">
          <div className="flex justify-between items-center text-center">
            <div className="flex-1">
              <img src={match.teams.home.logo} className="w-20 h-20 mx-auto mb-3" />
              <div className="font-bold text-xl">{match.teams.home.name}</div>
            </div>
            <div className="px-10">
              <div className="text-6xl font-black text-[#00ff87]">{match.goals.home} - {match.goals.away}</div>
              <div className="bg-[#ff4d4d] px-3 py-1 rounded text-xs font-bold mt-3 animate-pulse">
                {match.fixture.status.elapsed}'
              </div>
            </div>
            <div className="flex-1">
              <img src={match.teams.away.logo} className="w-20 h-20 mx-auto mb-3" />
              <div className="font-bold text-xl">{match.teams.away.name}</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b border-[#2d3748] mb-6 overflow-x-auto">
          {['resumen', 'estadisticas', 'alineaciones'].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`pb-3 px-4 text-sm font-bold uppercase transition ${activeTab === tab ? 'border-b-2 border-[#00ff87] text-[#00ff87]' : 'text-[#9ca3af]'}`}>
              {tab}
            </button>
          ))}
        </div>

        {/* Contenido Dinámico */}
        <div className="bg-[#1a2235] rounded-xl p-6 border border-[#2d3748]">
          {activeTab === 'resumen' && (
            <div className="space-y-4">
              <div className="flex justify-between border-b border-[#2d3748] pb-2 text-sm text-[#9ca3af]">
                <span>Estadio</span><span className="text-white">{match.fixture.venue.name}</span>
              </div>
              <div className="flex justify-between border-b border-[#2d3748] pb-2 text-sm text-[#9ca3af]">
                <span>Árbitro</span><span className="text-white">{match.fixture.referee || 'No asignado'}</span>
              </div>
              <div className="flex justify-between border-b border-[#2d3748] pb-2 text-sm text-[#9ca3af]">
                <span>Liga</span><span className="text-white">{match.league.name}</span>
              </div>
            </div>
          )}

          {activeTab === 'estadisticas' && (
            <div className="space-y-6">
              {stats.length > 0 ? stats[0].statistics.map((s: any) => (
                <div key={s.type}>
                  <div className="flex justify-between text-xs text-[#9ca3af] mb-1 uppercase font-bold">
                    <span>{s.value || 0}</span>
                    <span>{s.type}</span>
                    <span>{stats[1].statistics.find((st: any) => st.type === s.type)?.value || 0}</span>
                  </div>
                  <div className="h-1.5 bg-[#0f172a] rounded-full flex overflow-hidden">
                    <div style={{ width: '50%', backgroundColor: '#00ff87', height: '100%' }}></div>
                    <div style={{ width: '50%', backgroundColor: '#3b82f6', height: '100%' }}></div>
                  </div>
                </div>
              )) : <p className="text-center py-10">Estadísticas no disponibles aún.</p>}
            </div>
          )}

          {activeTab === 'alineaciones' && (
            <div className="grid grid-cols-2 gap-8 text-center">
              {lineups.map((l: any) => (
                <div key={l.team.id}>
                  <h4 className="text-[#00ff87] font-bold mb-4">{l.team.name} ({l.formation})</h4>
                  {l.startXI.map((p: any) => (
                    <div key={p.player.id} className="text-sm py-1 border-b border-[#2d3748]">
                      {p.player.number}. {p.player.name}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}