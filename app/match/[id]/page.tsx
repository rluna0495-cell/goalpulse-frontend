'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '../../components/Navbar';
import { footballApi } from '../../lib/api';

type TabType = 'summary' | 'stats' | 'lineups' | 'h2h';

export default function MatchDetailPage() {
  const { id } = useParams();
  const [match, setMatch] = useState<any>(null);
  const [stats, setStats] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('summary');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // En el futuro aquí llamaremos a la API real. 
        // Por ahora simulamos la carga para el diseño.
        const res = await footballApi.getMatch(Number(id));
        setMatch(res.data.data?.[0] || MOCK_MATCH);
        const statsRes = await footballApi.getMatchStats(Number(id));
        setStats(statsRes.data.data || MOCK_STATS);
      } catch (error) {
        console.error(error);
        setMatch(MOCK_MATCH);
        setStats(MOCK_STATS);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  if (loading) return <div style={{ color: 'white', textAlign: 'center', padding: '100px' }}>Cargando detalles...</div>;

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#0a0e1a', color: 'white' }}>
      <Navbar />
      
      {/* Marcador Superior (Scoreboard) */}
      <div style={{ 
        background: 'linear-gradient(to bottom, #1a2235, #0a0e1a)', 
        padding: '40px 20px', borderBottom: '1px solid #1f2937', textAlign: 'center' 
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '40px', maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ flex: 1 }}>
            <img src={match.teams.home.logo} style={{ width: '80px', marginBottom: '12px' }} alt="" />
            <h2 style={{ fontSize: '20px' }}>{match.teams.home.name}</h2>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', fontWeight: '900', letterSpacing: '4px' }}>
              {match.goals.home} : {match.goals.away}
            </div>
            <span style={{ color: '#00ff87', fontWeight: 'bold', fontSize: '14px' }}>{match.fixture.status.elapsed}'</span>
          </div>

          <div style={{ flex: 1 }}>
            <img src={match.teams.away.logo} style={{ width: '80px', marginBottom: '12px' }} alt="" />
            <h2 style={{ fontSize: '20px' }}>{match.teams.away.name}</h2>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
        {/* Navegación de Pestañas */}
        <div style={{ display: 'flex', borderBottom: '1px solid #1f2937', marginBottom: '30px', gap: '24px' }}>
          {[
            { id: 'summary', label: 'RESUMEN' },
            { id: 'stats', label: 'ESTADÍSTICAS' },
            { id: 'lineups', label: 'ALINEACIONES' },
            { id: 'h2h', label: 'H2H' }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              style={{
                padding: '12px 0', border: 'none', background: 'none', color: activeTab === tab.id ? '#00ff87' : '#9ca3af',
                fontWeight: 'bold', cursor: 'pointer', borderBottom: activeTab === tab.id ? '2px solid #00ff87' : 'none',
                fontSize: '13px'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Contenido de Pestañas */}
        {activeTab === 'stats' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {stats[0]?.statistics.map((s: any, idx: number) => {
              const homeVal = s.value || 0;
              const awayVal = stats[1].statistics[idx].value || 0;
              const total = (typeof homeVal === 'number' && typeof awayVal === 'number') ? homeVal + awayVal : 1;
              const homePct = typeof homeVal === 'string' ? parseInt(homeVal) : (homeVal / total) * 100;

              return (
                <div key={s.type} style={{ marginBottom: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
                    <span>{homeVal}</span>
                    <span style={{ color: '#9ca3af', textTransform: 'uppercase', fontSize: '12px' }}>{s.type}</span>
                    <span>{awayVal}</span>
                  </div>
                  <div style={{ display: 'flex', height: '6px', backgroundColor: '#1a2235', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${homePct}%`, backgroundColor: '#00ff87', transition: 'width 0.5s' }}></div>
                    <div style={{ flex: 1, backgroundColor: '#3b82f6', transition: 'width 0.5s' }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'summary' && (
          <div style={{ backgroundColor: '#1a2235', borderRadius: '12px', padding: '20px' }}>
            <h3 style={{ fontSize: '16px', marginBottom: '20px', color: '#9ca3af' }}>EVENTOS PRINCIPALES</h3>
            {/* Aquí mapearíamos match.events de la API */}
            <div style={{ textAlign: 'center', color: '#4b5563', padding: '40px' }}>
              Visualización de goles, tarjetas y sustituciones cronológicas...
            </div>
          </div>
        )}

        {activeTab === 'h2h' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ backgroundColor: '#1a2235', padding: '20px', borderRadius: '12px' }}>
              <h3 style={{ fontSize: '14px', color: '#00ff87', marginBottom: '15px' }}>ENFRENTAMIENTOS RECIENTES</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <tbody>
                  {[1, 2, 3].map(i => (
                    <tr key={i} style={{ borderBottom: '1px solid #0a0e1a' }}>
                      <td style={{ padding: '12px 0', color: '#9ca3af' }}>12.02.24</td>
                      <td style={{ textAlign: 'right' }}>Real Madrid</td>
                      <td style={{ textAlign: 'center', fontWeight: 'bold', color: '#00ff87', padding: '0 10px' }}>2 - 1</td>
                      <td>Barcelona</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div style={{ backgroundColor: '#1a2235', padding: '20px', borderRadius: '12px' }}>
                <h4 style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '10px' }}>FORMA LOCAL</h4>
                <div style={{ display: 'flex', gap: '5px' }}>
                  {['W', 'W', 'D', 'L', 'W'].map((v, i) => (
                    <span key={i} style={{ 
                      width: '24px', height: '24px', borderRadius: '4px', display: 'flex', alignItems: 'center', 
                      justifyContent: 'center', fontSize: '12px', fontWeight: 'bold',
                      backgroundColor: v === 'W' ? '#059669' : v === 'L' ? '#dc2626' : '#4b5563'
                    }}>{v}</span>
                  ))}
                </div>
              </div>
              <div style={{ backgroundColor: '#1a2235', padding: '20px', borderRadius: '12px' }}>
                <h4 style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '10px' }}>FORMA VISITANTE</h4>
                <div style={{ display: 'flex', gap: '5px' }}>
                  {['L', 'W', 'W', 'W', 'D'].map((v, i) => (
                    <span key={i} style={{ 
                      width: '24px', height: '24px', borderRadius: '4px', display: 'flex', alignItems: 'center', 
                      justifyContent: 'center', fontSize: '12px', fontWeight: 'bold',
                      backgroundColor: v === 'W' ? '#059669' : v === 'L' ? '#dc2626' : '#4b5563'
                    }}>{v}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'lineups' && (
          <div style={{ backgroundColor: '#1a2235', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
             <div style={{ 
               height: '400px', width: '100%', backgroundImage: 'url(https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=500)',
               backgroundSize: 'cover', borderRadius: '8px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center'
             }}>
               <div style={{ backgroundColor: 'rgba(0,0,0,0.6)', padding: '20px', borderRadius: '12px' }}>
                  <p style={{ fontWeight: 'bold' }}>CAMPO TÁCTICO</p>
                  <p style={{ fontSize: '12px', color: '#9ca3af' }}>Alineaciones 4-3-3 vs 4-4-2</p>
               </div>
             </div>
          </div>
        )}
      </div>
    </main>
  );
}

// --- MOCK DATA PARA PRUEBAS DE DISEÑO ---
const MOCK_MATCH = {
  fixture: { id: 1, status: { short: 'LIVE', elapsed: 72 }, date: new Date().toISOString() },
  teams: {
    home: { name: 'Real Madrid', logo: 'https://media.api-sports.io/football/teams/541.png' },
    away: { name: 'Barcelona', logo: 'https://media.api-sports.io/football/teams/529.png' }
  },
  goals: { home: 3, away: 2 },
  league: { name: 'La Liga', country: 'España' }
};

const MOCK_STATS = [
  {
    team: { id: 541, name: 'Real Madrid' },
    statistics: [
      { type: 'Ball Possession', value: '45%' },
      { type: 'Total Shots', value: 14 },
      { type: 'Shots on Goal', value: 6 },
      { type: 'Corner Kicks', value: 5 },
      { type: 'Fouls', value: 12 },
      { type: 'Yellow Cards', value: 2 },
    ]
  },
  {
    team: { id: 529, name: 'Barcelona' },
    statistics: [
      { type: 'Ball Possession', value: '55%' },
      { type: 'Total Shots', value: 11 },
      { type: 'Shots on Goal', value: 4 },
      { type: 'Corner Kicks', value: 8 },
      { type: 'Fouls', value: 15 },
      { type: 'Yellow Cards', value: 3 },
    ]
  }
];