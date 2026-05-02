'use client';
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { basketballApi } from '../lib/api';

export default function BasketballPage() {
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
        basketballApi.getLive(),
        basketballApi.getToday(),
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

  const getQuarterScore = (scores: any) => {
    if (!scores) return '-';
    return scores.total ?? '-';
  };

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#0a0e1a' }}>
      <Navbar />
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
        <h1 style={{
          fontSize: '32px', fontWeight: 'bold', marginBottom: '24px',
          background: 'linear-gradient(90deg, #f97316, #ef4444)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>🏀 Baloncesto Mundial</h1>

        <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', backgroundColor: '#1a2235', borderRadius: '10px', padding: '4px', width: 'fit-content' }}>
          {(['live', 'today'] as const).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              padding: '8px 24px', borderRadius: '8px', border: 'none',
              backgroundColor: activeTab === tab ? '#f97316' : 'transparent',
              color: activeTab === tab ? 'white' : '#9ca3af',
              cursor: 'pointer', fontSize: '14px', fontWeight: '600',
            }}>
              {tab === 'live' ? `🔴 En Vivo (${liveMatches.length})` : `📅 Próximos (${todayMatches.length})`}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px', color: '#9ca3af' }}>
            <div style={{ fontSize: '48px' }}>🏀</div>
            <p>Cargando partidos...</p>
          </div>
        ) : displayMatches.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', backgroundColor: '#1a2235', borderRadius: '12px', color: '#9ca3af' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
            <p>No hay partidos {activeTab === 'live' ? 'en vivo' : 'programados'} en este momento</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {displayMatches.map((match: any, index: number) => {
              const isLive = match.status?.short === 'LIVE' || match.status?.short === 'Q1' || match.status?.short === 'Q2' || match.status?.short === 'Q3' || match.status?.short === 'Q4' || match.status?.short === 'HT';
              return (
                <div key={index} style={{
                  backgroundColor: '#1a2235', borderRadius: '12px', padding: '20px',
                  border: isLive ? '1px solid #f97316' : '1px solid #1f2937',
                }}>
                  {/* Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {match.league?.logo && (
                        <img src={match.league.logo} alt="" style={{ width: '20px', height: '20px', objectFit: 'contain' }} />
                      )}
                      <span style={{ fontSize: '12px', color: '#9ca3af' }}>{match.league?.name} — {match.country?.name}</span>
                    </div>
                    {isLive ? (
                      <span style={{ backgroundColor: '#dc2626', color: 'white', fontSize: '11px', padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold' }}>
                        🔴 {match.status?.short} — {match.status?.timer}'
                      </span>
                    ) : (
                      <span style={{ fontSize: '12px', color: '#9ca3af' }}>
                        {match.date ? new Date(match.date).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }) : 'Finalizado'}
                      </span>
                    )}
                  </div>

                  {/* Equipos y marcador */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                        {match.teams?.home?.logo && (
                          <img src={match.teams.home.logo} alt="" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
                        )}
                        <span style={{ fontSize: '15px', fontWeight: '600', color: 'white' }}>{match.teams?.home?.name}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {match.teams?.away?.logo && (
                          <img src={match.teams.away.logo} alt="" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
                        )}
                        <span style={{ fontSize: '15px', fontWeight: '600', color: 'white' }}>{match.teams?.away?.name}</span>
                      </div>
                    </div>

                    {/* Marcador por cuartos */}
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      {['quarter_1', 'quarter_2', 'quarter_3', 'quarter_4'].map((q, i) => (
                        <div key={q} style={{ textAlign: 'center', minWidth: '36px' }}>
                          <div style={{ fontSize: '10px', color: '#9ca3af', marginBottom: '4px' }}>Q{i + 1}</div>
                          <div style={{ fontSize: '13px', color: '#9ca3af' }}>{match.scores?.home?.[q] ?? '-'}</div>
                          <div style={{ fontSize: '13px', color: '#9ca3af' }}>{match.scores?.away?.[q] ?? '-'}</div>
                        </div>
                      ))}
                      <div style={{ textAlign: 'center', minWidth: '50px', borderLeft: '1px solid #1f2937', paddingLeft: '8px' }}>
                        <div style={{ fontSize: '10px', color: '#9ca3af', marginBottom: '4px' }}>TOT</div>
                        <div style={{ fontSize: '20px', fontWeight: 'bold', color: isLive ? '#f97316' : 'white' }}>{getQuarterScore(match.scores?.home)}</div>
                        <div style={{ fontSize: '20px', fontWeight: 'bold', color: isLive ? '#f97316' : 'white' }}>{getQuarterScore(match.scores?.away)}</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}