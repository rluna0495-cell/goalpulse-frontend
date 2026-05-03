'use client';
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { footballApi } from '../lib/api';

const LEAGUES = [
  { id: 39, name: 'Premier League', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', season: 2024 },
  { id: 140, name: 'LaLiga', flag: '🇪🇸', season: 2024 },
  { id: 135, name: 'Serie A', flag: '🇮🇹', season: 2024 },
  { id: 78, name: 'Bundesliga', flag: '🇩🇪', season: 2024 },
  { id: 61, name: 'Ligue 1', flag: '🇫🇷', season: 2024 },
  { id: 2, name: 'Champions League', flag: '🏆', season: 2024 },
  { id: 253, name: 'MLS', flag: '🇺🇸', season: 2025 },
  { id: 71, name: 'Brasileirao', flag: '🇧🇷', season: 2025 },
  { id: 239, name: 'Primera A Colombia', flag: '🇨🇴', season: 2025 },
  { id: 262, name: 'Liga MX', flag: '🇲🇽', season: 2025 },
];

export default function StandingsPage() {
  const [standings, setStandings] = useState<any[]>([]);
  const [selectedLeague, setSelectedLeague] = useState(LEAGUES[0]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStandings();
  }, [selectedLeague]);

  const fetchStandings = async () => {
    try {
      setLoading(true);
      const res = await footballApi.getStandings(selectedLeague.id, selectedLeague.season);
      const data = res.data.data;
      if (data && data[0]?.league?.standings) {
        setStandings(data[0].league.standings[0] || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#0a0e1a' }}>
      <Navbar />
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 24px' }}>
        <h1 style={{
          fontSize: '32px', fontWeight: 'bold', marginBottom: '24px',
          background: 'linear-gradient(90deg, #00ff87, #3b82f6)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>🏆 Tablas de Posiciones</h1>

        {/* Selector de ligas */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
          {LEAGUES.map((league) => (
            <button key={league.id} onClick={() => setSelectedLeague(league)} style={{
              padding: '8px 16px', borderRadius: '20px', border: 'none',
              backgroundColor: selectedLeague.id === league.id ? '#00ff87' : '#1a2235',
              color: selectedLeague.id === league.id ? '#000' : '#9ca3af',
              cursor: 'pointer', fontSize: '13px', fontWeight: '600',
            }}>
              {league.flag} {league.name}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px', color: '#9ca3af' }}>
            <div style={{ fontSize: '48px' }}>⚽</div>
            <p>Cargando tabla...</p>
          </div>
        ) : standings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', backgroundColor: '#1a2235', borderRadius: '12px', color: '#9ca3af' }}>
            No hay datos disponibles
          </div>
        ) : (
          <div style={{ backgroundColor: '#1a2235', borderRadius: '16px', overflow: 'hidden', border: '1px solid #1f2937' }}>
            {/* Header */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '40px 1fr 40px 40px 40px 40px 40px 40px 50px',
              gap: '8px', padding: '12px 16px',
              backgroundColor: '#111827', fontSize: '12px', color: '#9ca3af', fontWeight: '600',
            }}>
              <span>#</span>
              <span>Equipo</span>
              <span style={{ textAlign: 'center' }}>PJ</span>
              <span style={{ textAlign: 'center' }}>G</span>
              <span style={{ textAlign: 'center' }}>E</span>
              <span style={{ textAlign: 'center' }}>P</span>
              <span style={{ textAlign: 'center' }}>GF</span>
              <span style={{ textAlign: 'center' }}>GC</span>
              <span style={{ textAlign: 'center' }}>Pts</span>
            </div>

            {standings.map((team: any, index: number) => (
              <div key={team.team.id} style={{
                display: 'grid',
                gridTemplateColumns: '40px 1fr 40px 40px 40px 40px 40px 40px 50px',
                gap: '8px', padding: '12px 16px',
                borderTop: '1px solid #1f2937',
                backgroundColor: index % 2 === 0 ? '#1a2235' : '#1f2937',
                alignItems: 'center',
              }}>
                <span style={{
                  fontSize: '13px', fontWeight: '700',
                  color: index < 4 ? '#00ff87' : index < 6 ? '#3b82f6' : index >= standings.length - 3 ? '#dc2626' : '#9ca3af',
                }}>
                  {team.rank}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <img src={team.team.logo} alt={team.team.name}
                    style={{ width: '24px', height: '24px', objectFit: 'contain' }}
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                  <span style={{ fontSize: '14px', fontWeight: '500', color: 'white' }}>{team.team.name}</span>
                </div>
                <span style={{ textAlign: 'center', fontSize: '13px', color: '#9ca3af' }}>{team.all.played}</span>
                <span style={{ textAlign: 'center', fontSize: '13px', color: '#9ca3af' }}>{team.all.win}</span>
                <span style={{ textAlign: 'center', fontSize: '13px', color: '#9ca3af' }}>{team.all.draw}</span>
                <span style={{ textAlign: 'center', fontSize: '13px', color: '#9ca3af' }}>{team.all.lose}</span>
                <span style={{ textAlign: 'center', fontSize: '13px', color: '#9ca3af' }}>{team.all.goals.for}</span>
                <span style={{ textAlign: 'center', fontSize: '13px', color: '#9ca3af' }}>{team.all.goals.against}</span>
                <span style={{ textAlign: 'center', fontSize: '15px', fontWeight: '700', color: 'white' }}>{team.points}</span>
              </div>
            ))}

            {/* Leyenda */}
            <div style={{ padding: '12px 16px', borderTop: '1px solid #1f2937', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              {[
                { color: '#00ff87', label: 'Champions League' },
                { color: '#3b82f6', label: 'Europa League' },
                { color: '#dc2626', label: 'Descenso' },
              ].map((item) => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: item.color }} />
                  <span style={{ fontSize: '12px', color: '#9ca3af' }}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}