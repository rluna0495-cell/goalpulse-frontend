'use client';
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { tennisApi } from '../lib/api';

export default function TennisPage() {
  const [liveMatches, setLiveMatches] = useState<any[]>([]);
  const [todayMatches, setTodayMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'live' | 'today'>('today');

  useEffect(() => {
    fetchMatches();
    const interval = setInterval(fetchMatches, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const [liveRes, todayRes] = await Promise.all([
        tennisApi.getLive(),
        tennisApi.getToday(),
      ]);
      setLiveMatches(liveRes.data.data || []);
      setTodayMatches(todayRes.data.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const displayMatches = activeTab === 'live' ? liveMatches : todayMatches;

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#0a0e1a' }}>
      <Navbar />
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
        <h1 style={{
          fontSize: '32px', fontWeight: 'bold', marginBottom: '24px',
          background: 'linear-gradient(90deg, #84cc16, #22c55e)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>🎾 Tenis Mundial</h1>

        <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', backgroundColor: '#1a2235', borderRadius: '10px', padding: '4px', width: 'fit-content' }}>
          {(['live', 'today'] as const).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              padding: '8px 24px', borderRadius: '8px', border: 'none',
              backgroundColor: activeTab === tab ? '#84cc16' : 'transparent',
              color: activeTab === tab ? '#000' : '#9ca3af',
              cursor: 'pointer', fontSize: '14px', fontWeight: '600',
            }}>
              {tab === 'live' ? `🔴 En Vivo (${liveMatches.length})` : `📅 Hoy (${todayMatches.length})`}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px', color: '#9ca3af' }}>
            <div style={{ fontSize: '48px' }}>🎾</div>
            <p>Cargando partidos...</p>
          </div>
        ) : displayMatches.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', backgroundColor: '#1a2235', borderRadius: '12px', color: '#9ca3af' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
            <p>No hay partidos {activeTab === 'live' ? 'en vivo' : 'programados'} en este momento</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {displayMatches.map((match: any, index: number) => (
              <div key={index} style={{
                backgroundColor: '#1a2235', borderRadius: '12px', padding: '20px',
                border: '1px solid #1f2937',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <span style={{ fontSize: '12px', color: '#9ca3af' }}>
                    🏆 {match.strLeague || match.tournament?.name || 'Torneo'}
                  </span>
                  <span style={{ fontSize: '12px', color: '#9ca3af' }}>
                    {match.strTime || match.status?.long || ''}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '15px', fontWeight: '600', color: 'white' }}>
                    {match.strHomeTeam || match.players?.home?.name || 'Jugador 1'}
                  </span>
                  <div style={{ padding: '8px 20px', backgroundColor: '#0a0e1a', borderRadius: '8px', textAlign: 'center' }}>
                    <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#84cc16' }}>
                      {match.intHomeScore ?? '-'} : {match.intAwayScore ?? '-'}
                    </span>
                  </div>
                  <span style={{ fontSize: '15px', fontWeight: '600', color: 'white' }}>
                    {match.strAwayTeam || match.players?.away?.name || 'Jugador 2'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}