'use client';
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { baseballApi } from '../lib/api';

export default function BaseballPage() {
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
        baseballApi.getLive(),
        baseballApi.getToday(),
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
          background: 'linear-gradient(90deg, #eab308, #f97316)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>⚾ Béisbol Mundial</h1>

        <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', backgroundColor: '#1a2235', borderRadius: '10px', padding: '4px', width: 'fit-content' }}>
          {(['live', 'today'] as const).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              padding: '8px 24px', borderRadius: '8px', border: 'none',
              backgroundColor: activeTab === tab ? '#eab308' : 'transparent',
              color: activeTab === tab ? '#000' : '#9ca3af',
              cursor: 'pointer', fontSize: '14px', fontWeight: '600',
            }}>
              {tab === 'live' ? `🔴 En Vivo (${liveMatches.length})` : `📅 Próximos (${todayMatches.length})`}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px', color: '#9ca3af' }}>
            <div style={{ fontSize: '48px' }}>⚾</div>
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
              const isLive = match.status?.short === 'LIVE' || match.status?.short === 'IN';
              return (
                <div key={index} style={{
                  backgroundColor: '#1a2235', borderRadius: '12px', padding: '20px',
                  border: isLive ? '1px solid #eab308' : '1px solid #1f2937',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {match.league?.logo && (
                        <img src={match.league.logo} alt="" style={{ width: '20px', height: '20px', objectFit: 'contain' }} />
                      )}
                      <span style={{ fontSize: '12px', color: '#9ca3af' }}>{match.league?.name} — {match.country?.name}</span>
                    </div>
                    {isLive ? (
                      <span style={{ backgroundColor: '#dc2626', color: 'white', fontSize: '11px', padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold' }}>
                        🔴 EN VIVO — Inning {match.status?.innings}
                      </span>
                    ) : (
                      <span style={{ fontSize: '12px', color: '#9ca3af' }}>
                        {match.date ? new Date(match.date).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }) : match.status?.long}
                      </span>
                    )}
                  </div>

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

                    {/* Innings */}
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      {[1,2,3,4,5,6,7,8,9].map((inning) => (
                        <div key={inning} style={{ textAlign: 'center', minWidth: '28px' }}>
                          <div style={{ fontSize: '10px', color: '#9ca3af', marginBottom: '4px' }}>{inning}</div>
                          <div style={{ fontSize: '12px', color: '#9ca3af' }}>{match.scores?.home?.innings?.[inning] ?? '-'}</div>
                          <div style={{ fontSize: '12px', color: '#9ca3af' }}>{match.scores?.away?.innings?.[inning] ?? '-'}</div>
                        </div>
                      ))}
                      <div style={{ textAlign: 'center', minWidth: '44px', borderLeft: '1px solid #1f2937', paddingLeft: '8px' }}>
                        <div style={{ fontSize: '10px', color: '#9ca3af', marginBottom: '4px' }}>R</div>
                        <div style={{ fontSize: '20px', fontWeight: 'bold', color: isLive ? '#eab308' : 'white' }}>{match.scores?.home?.total ?? '-'}</div>
                        <div style={{ fontSize: '20px', fontWeight: 'bold', color: isLive ? '#eab308' : 'white' }}>{match.scores?.away?.total ?? '-'}</div>
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