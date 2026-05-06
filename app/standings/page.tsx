'use client';
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { footballApi } from '../lib/api';

export default function StandingsPage() {
  const [standings, setStandings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Por defecto cargamos LaLiga (140) temporada 2023 para pruebas
    loadStandings(140);
  }, []);

  const loadStandings = async (leagueId: number) => {
    try {
      setLoading(true);
      const res = await footballApi.getStandings(leagueId, 2023);
      const data = res.data.data?.[0]?.league?.standings?.[0] || [];
      setStandings(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#0a0e1a', color: 'white' }}>
      <Navbar />
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 24px' }}>
        <h1 style={{ marginBottom: '24px' }}>📊 Tabla de Posiciones</h1>
        
        <div style={{ backgroundColor: '#1a2235', borderRadius: '12px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#111827', color: '#9ca3af', fontSize: '12px' }}>
                <th style={{ padding: '12px' }}>#</th>
                <th style={{ padding: '12px' }}>Equipo</th>
                <th style={{ padding: '12px' }}>PJ</th>
                <th style={{ padding: '12px' }}>G</th>
                <th style={{ padding: '12px' }}>E</th>
                <th style={{ padding: '12px' }}>P</th>
                <th style={{ padding: '12px' }}>GF:GC</th>
                <th style={{ padding: '12px', fontWeight: 'bold', color: '#00ff87' }}>PTS</th>
              </tr>
            </thead>
            <tbody>
              {standings.map((team: any) => (
                <tr key={team.team.id} style={{ borderBottom: '1px solid #1f2937' }}>
                  <td style={{ padding: '12px', fontSize: '14px' }}>{team.rank}</td>
                  <td style={{ padding: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <img src={team.team.logo} style={{ width: '20px' }} alt="" />
                    <span style={{ fontSize: '14px', fontWeight: '500' }}>{team.team.name}</span>
                  </td>
                  <td style={{ padding: '12px', fontSize: '14px' }}>{team.all.played}</td>
                  <td style={{ padding: '12px', fontSize: '14px' }}>{team.all.win}</td>
                  <td style={{ padding: '12px', fontSize: '14px' }}>{team.all.draw}</td>
                  <td style={{ padding: '12px', fontSize: '14px' }}>{team.all.lose}</td>
                  <td style={{ padding: '12px', fontSize: '14px', color: '#9ca3af' }}>
                    {team.all.goals.for}:{team.all.goals.against}
                  </td>
                  <td style={{ padding: '12px', fontSize: '15px', fontWeight: 'bold', color: '#00ff87' }}>
                    {team.points}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {loading && <p style={{ textAlign: 'center', padding: '20px' }}>Cargando tabla...</p>}
        </div>
      </div>
    </main>
  );
}