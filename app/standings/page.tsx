'use client';
import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import MatchCard from './components/MatchCard';
import { footballApi } from './lib/api';

const TOP_LEAGUES = [
  { id: 2, name: 'Champions League', flag: '🏆', color: '#1e3a5f' },
  { id: 3, name: 'Europa League', flag: '🌍', color: '#1a3a2a' },
  { id: 39, name: 'Premier League', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', color: '#3a1a1a' },
  { id: 140, name: 'LaLiga', flag: '🇪🇸', color: '#3a1a1a' },
  { id: 135, name: 'Serie A', flag: '🇮🇹', color: '#1a1a3a' },
  { id: 78, name: 'Bundesliga', flag: '🇩🇪', color: '#3a2a1a' },
  { id: 61, name: 'Ligue 1', flag: '🇫🇷', color: '#1a1a3a' },
  { id: 253, name: 'MLS', flag: '🇺🇸', color: '#1a2a3a' },
  { id: 71, name: 'Brasileirao', flag: '🇧🇷', color: '#1a3a1a' },
  { id: 239, name: 'Primera A Colombia', flag: '🇨🇴', color: '#2a1a1a' },
];

export default function Home() {
  const [liveMatches, setLiveMatches] = useState<any[]>([]);
  const [todayMatches, setTodayMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'live' | 'today'>('live');
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000);
    return () => { clearInterval(interval); clearInterval(timeInterval); };
  }, []);

  const fetchData = async () => {
    try {
      const [liveRes, todayRes] = await Promise.all([
        footballApi.getLive(),
        footballApi.getToday(),
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

  const groupedByLeague = displayMatches.reduce((acc: any, match: any) => {
    const leagueName = match.league.name;
    if (!acc[leagueName]) acc[leagueName] = { info: match.league, matches: [] };
    acc[leagueName].matches.push(match);
    return acc;
  }, {});

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#070d1a' }}>
      <Navbar />

      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, #070d1a 0%, #0f1f3d 50%, #070d1a 100%)',
        padding: '40px 24px 32px',
        borderBottom: '1px solid #1a2a4a',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Fondo animado */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(0,255,135,0.05) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(59,130,246,0.05) 0%, transparent 50%)',
          pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '24px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#dc2626', boxShadow: '0 0 8px #dc2626' }} />
                <span style={{ fontSize: '12px', color: '#dc2626', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase' }}>En Vivo Ahora</span>
              </div>
              <h1 style={{
                fontSize: '52px', fontWeight: '900', marginBottom: '8px', lineHeight: 1.1,
                background: 'linear-gradient(90deg, #00ff87, #3b82f6)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>⚡ GoalPulse</h1>
              <p style={{ color: '#6b7fa3', fontSize: '15px' }}>
                Resultados en tiempo real · Todas las ligas del mundo
              </p>
            </div>

            {/* Reloj en vivo */}
            <div style={{
              backgroundColor: '#0f1f3d', border: '1px solid #1a2a4a', borderRadius: '16px',
              padding: '16px 24px', textAlign: 'center',
            }}>
              <div style={{ fontSize: '28px', fontWeight: '900', color: '#00ff87', fontFamily: 'monospace' }}>
                {currentTime}
              </div>
              <div style={{ fontSize: '11px', color: '#6b7fa3', marginTop: '4px' }}>
                {new Date().toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' })}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', gap: '16px', marginTop: '32px', flexWrap: 'wrap' }}>
            {[
              { label: 'Partidos en Vivo', value: liveMatches.length, color: '#dc2626', icon: '🔴', bg: 'rgba(220,38,38,0.1)' },
              { label: 'Partidos Hoy', value: todayMatches.length, color: '#3b82f6', icon: '📅', bg: 'rgba(59,130,246,0.1)' },
              { label: 'Ligas Activas', value: Object.keys(groupedByLeague).length, color: '#00ff87', icon: '🏆', bg: 'rgba(0,255,135,0.1)' },
            ].map((stat) => (
              <div key={stat.label} style={{
                backgroundColor: stat.bg, border: `1px solid ${stat.color}30`,
                borderRadius: '12px', padding: '16px 24px',
                display: 'flex', alignItems: 'center', gap: '12px',
              }}>
                <span style={{ fontSize: '24px' }}>{stat.icon}</span>
                <div>
                  <div style={{ fontSize: '28px', fontWeight: '900', color: stat.color }}>{stat.value}</div>
                  <div style={{ fontSize: '12px', color: '#6b7fa3' }}>{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
        {/* Ligas destacadas */}
        <div style={{ marginBottom: '28px' }}>
          <h2 style={{ fontSize: '13px', color: '#6b7fa3', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '600' }}>
            Ligas Destacadas
          </h2>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {TOP_LEAGUES.map((league) => (
              <a key={league.id} href="/football" style={{ textDecoration: 'none' }}>
                <div style={{
                  padding: '6px 14px', borderRadius: '20px',
                  backgroundColor: league.color, border: '1px solid rgba(255,255,255,0.1)',
                  color: '#e5e7eb', fontSize: '12px', cursor: 'pointer',
                  transition: 'all 0.2s', fontWeight: '500',
                }}>
                  {league.flag} {league.name}
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', backgroundColor: '#0f1f3d', borderRadius: '12px', padding: '4px', width: 'fit-content', border: '1px solid #1a2a4a' }}>
          {(['live', 'today'] as const).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              padding: '10px 28px', borderRadius: '10px', border: 'none',
              backgroundColor: activeTab === tab ? (tab === 'live' ? '#dc2626' : '#3b82f6') : 'transparent',
              color: activeTab === tab ? 'white' : '#6b7fa3',
              cursor: 'pointer', fontSize: '14px', fontWeight: '600',
              transition: 'all 0.2s',
            }}>
              {tab === 'live' ? `🔴 En Vivo (${liveMatches.length})` : `📅 Hoy (${todayMatches.length})`}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px', color: '#6b7fa3' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚡</div>
            <p>Cargando partidos...</p>
          </div>
        ) : Object.keys(groupedByLeague).length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', backgroundColor: '#0f1f3d', borderRadius: '16px', color: '#6b7fa3', border: '1px solid #1a2a4a' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
            <p style={{ fontSize: '16px' }}>No hay partidos {activeTab === 'live' ? 'en vivo' : 'hoy'} en este momento</p>
            <p style={{ fontSize: '13px', marginTop: '8px', color: '#4a5a7a' }}>Los datos se actualizan automáticamente cada 30 segundos</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {Object.entries(groupedByLeague).map(([leagueName, leagueData]: any) => (
              <div key={leagueName} style={{
                backgroundColor: '#0a1628', borderRadius: '16px',
                border: '1px solid #1a2a4a', overflow: 'hidden',
              }}>
                {/* Header de liga */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '12px 16px', backgroundColor: '#0f1f3d',
                  borderBottom: '1px solid #1a2a4a',
                }}>
                  <img src={leagueData.info.logo} alt={leagueName}
                    style={{ width: '28px', height: '28px', objectFit: 'contain' }}
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                  <div>
                    <span style={{ fontSize: '14px', fontWeight: '700', color: 'white' }}>{leagueName}</span>
                    <span style={{ fontSize: '12px', color: '#6b7fa3', marginLeft: '8px' }}>{leagueData.info.country}</span>
                  </div>
                  <span style={{
                    marginLeft: 'auto', fontSize: '11px', color: '#6b7fa3',
                    backgroundColor: '#1a2a4a', padding: '2px 8px', borderRadius: '10px',
                  }}>
                    {leagueData.matches.length} partido{leagueData.matches.length > 1 ? 's' : ''}
                  </span>
                </div>

                {/* Partidos */}
                <div style={{ padding: '8px' }}>
                  {leagueData.matches.map((match: any) => (
                    <MatchCard
                      key={match.fixture.id}
                      id={match.fixture.id}
                      homeTeam={match.teams.home}
                      awayTeam={match.teams.away}
                      goals={match.goals}
                      status={match.fixture.status.short}
                      league={leagueName}
                      time={activeTab === 'live'
                        ? `${match.fixture.status.elapsed || 0}'`
                        : new Date(match.fixture.date).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}