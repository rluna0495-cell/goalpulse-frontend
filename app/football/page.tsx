'use client';
import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import MatchCard from './components/MatchCard';
import { footballApi } from './lib/api';

const TOP_LEAGUES = [
  { id: 2, name: 'Champions League', flag: '🏆' },
  { id: 3, name: 'Europa League', flag: '🌍' },
  { id: 39, name: 'Premier League', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { id: 140, name: 'LaLiga', flag: '🇪🇸' },
  { id: 135, name: 'Serie A', flag: '🇮🇹' },
  { id: 78, name: 'Bundesliga', flag: '🇩🇪' },
  { id: 61, name: 'Ligue 1', flag: '🇫🇷' },
  { id: 253, name: 'MLS', flag: '🇺🇸' },
  { id: 71, name: 'Brasileirao', flag: '🇧🇷' },
  { id: 239, name: 'Primera A Colombia', flag: '🇨🇴' },
];

export default function Home() {
  const [liveMatches, setLiveMatches] = useState<any[]>([]);
  const [todayMatches, setTodayMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'live' | 'today'>('live');

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
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
    <main style={{ minHeight: '100vh', backgroundColor: '#0a0e1a' }}>
      <Navbar />

      <div style={{
        background: 'linear-gradient(135deg, #0a0e1a 0%, #1a2235 50%, #0a0e1a 100%)',
        padding: '48px 24px 32px',
        textAlign: 'center',
        borderBottom: '1px solid #1f2937',
      }}>
        <h1 style={{
          fontSize: '48px', fontWeight: '900', marginBottom: '8px',
          background: 'linear-gradient(90deg, #00ff87, #3b82f6)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>⚡ GoalPulse</h1>
        <p style={{ color: '#9ca3af', fontSize: '16px', marginBottom: '32px' }}>
          Resultados de fútbol en tiempo real — Todas las ligas del mundo
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '48px' }}>
          {[
            { label: 'En Vivo', value: liveMatches.length, color: '#dc2626' },
            { label: 'Hoy', value: todayMatches.length, color: '#3b82f6' },
            { label: 'Ligas', value: '10+', color: '#00ff87' },
          ].map((stat) => (
            <div key={stat.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '36px', fontWeight: 'bold', color: stat.color }}>{stat.value}</div>
              <div style={{ fontSize: '13px', color: '#9ca3af' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '16px', color: '#9ca3af', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Ligas Destacadas
          </h2>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {TOP_LEAGUES.map((league) => (
              <a key={league.id} href="/football" style={{ textDecoration: 'none' }}>
                <div style={{
                  padding: '8px 16px', borderRadius: '20px',
                  backgroundColor: '#1a2235', border: '1px solid #1f2937',
                  color: '#e5e7eb', fontSize: '13px', cursor: 'pointer',
                }}>
                  {league.flag} {league.name}
                </div>
              </a>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', backgroundColor: '#1a2235', borderRadius: '10px', padding: '4px', width: 'fit-content' }}>
          {(['live', 'today'] as const).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              padding: '10px 28px', borderRadius: '8px', border: 'none',
              backgroundColor: activeTab === tab ? '#3b82f6' : 'transparent',
              color: activeTab === tab ? 'white' : '#9ca3af',
              cursor: 'pointer', fontSize: '14px', fontWeight: '600',
            }}>
              {tab === 'live' ? `🔴 En Vivo (${liveMatches.length})` : `📅 Hoy (${todayMatches.length})`}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px', color: '#9ca3af' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚡</div>
            <p>Cargando partidos...</p>
          </div>
        ) : Object.keys(groupedByLeague).length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', backgroundColor: '#1a2235', borderRadius: '12px', color: '#9ca3af' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
            <p>No hay partidos {activeTab === 'live' ? 'en vivo' : 'hoy'} en este momento</p>
            <p style={{ fontSize: '13px', marginTop: '8px' }}>Los datos se actualizan automáticamente</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {Object.entries(groupedByLeague).map(([leagueName, leagueData]: any) => (
              <div key={leagueName}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  marginBottom: '12px', padding: '8px 0',
                  borderBottom: '1px solid #1f2937',
                }}>
                  <img src={leagueData.info.logo} alt={leagueName}
                    style={{ width: '24px', height: '24px', objectFit: 'contain' }}
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                  <span style={{ fontSize: '14px', fontWeight: '600', color: 'white' }}>{leagueName}</span>
                  <span style={{ fontSize: '12px', color: '#9ca3af' }}>— {leagueData.info.country}</span>
                  <span style={{ fontSize: '12px', color: '#9ca3af', marginLeft: 'auto' }}>
                    {leagueData.matches.length} partido{leagueData.matches.length > 1 ? 's' : ''}
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
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