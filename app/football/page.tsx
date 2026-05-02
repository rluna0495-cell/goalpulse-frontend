'use client';
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import MatchCard from '../components/MatchCard';
import { footballApi } from '../lib/api';

const LEAGUES = [
  { id: 39, name: 'Premier League', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { id: 140, name: 'LaLiga', flag: '🇪🇸' },
  { id: 135, name: 'Serie A', flag: '🇮🇹' },
  { id: 78, name: 'Bundesliga', flag: '🇩🇪' },
  { id: 61, name: 'Ligue 1', flag: '🇫🇷' },
  { id: 2, name: 'Champions League', flag: '🌍' },
  { id: 3, name: 'Europa League', flag: '🌍' },
  { id: 253, name: 'MLS', flag: '🇺🇸' },
  { id: 71, name: 'Brasileirao', flag: '🇧🇷' },
  { id: 128, name: 'Liga Argentina', flag: '🇦🇷' },
  { id: 262, name: 'Liga MX', flag: '🇲🇽' },
  { id: 239, name: 'Primera A Colombia', flag: '🇨🇴' },
];

export default function FootballPage() {
  const [liveMatches, setLiveMatches] = useState<any[]>([]);
  const [todayMatches, setTodayMatches] = useState<any[]>([]);
  const [selectedLeague, setSelectedLeague] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'live' | 'today'>('live');

  useEffect(() => {
    fetchMatches();
    const interval = setInterval(fetchMatches, 30000);
    return () => clearInterval(interval);
  }, [selectedLeague]);

 const fetchMatches = async () => {
  try {
    setLoading(true);
    const [liveRes, todayRes] = await Promise.all([
      footballApi.getLive(),
      footballApi.getToday(),
    ]);

    let live = liveRes.data.data || [];
    let today = todayRes.data.data || [];

    if (selectedLeague) {
      live = live.filter((m: any) => Number(m.league.id) === Number(selectedLeague));
      today = today.filter((m: any) => Number(m.league.id) === Number(selectedLeague));
    }

    setLiveMatches(live);
    setTodayMatches(today);
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
          background: 'linear-gradient(90deg, #00ff87, #3b82f6)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>⚽ Fútbol Mundial</h1>

        {/* Filtros de liga */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
          <button onClick={() => setSelectedLeague(undefined)} style={{
            padding: '8px 16px', borderRadius: '20px', border: 'none',
            backgroundColor: !selectedLeague ? '#00ff87' : '#1a2235',
            color: !selectedLeague ? '#000' : '#9ca3af',
            cursor: 'pointer', fontSize: '13px', fontWeight: '600',
          }}>Todas</button>
          {LEAGUES.map((league) => (
            <button key={league.id} onClick={() => setSelectedLeague(league.id)} style={{
              padding: '8px 16px', borderRadius: '20px', border: 'none',
              backgroundColor: selectedLeague === league.id ? '#00ff87' : '#1a2235',
              color: selectedLeague === league.id ? '#000' : '#9ca3af',
              cursor: 'pointer', fontSize: '13px', fontWeight: '600',
            }}>{league.flag} {league.name}</button>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', backgroundColor: '#1a2235', borderRadius: '10px', padding: '4px', width: 'fit-content' }}>
          {(['live', 'today'] as const).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              padding: '8px 24px', borderRadius: '8px', border: 'none',
              backgroundColor: activeTab === tab ? '#3b82f6' : 'transparent',
              color: activeTab === tab ? 'white' : '#9ca3af',
              cursor: 'pointer', fontSize: '14px', fontWeight: '600',
            }}>
              {tab === 'live' ? `🔴 En Vivo (${liveMatches.length})` : `📅 Próximos (${todayMatches.length})`}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px', color: '#9ca3af' }}>
            <div style={{ fontSize: '48px' }}>⚽</div>
            <p>Cargando partidos...</p>
          </div>
        ) : displayMatches.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', backgroundColor: '#1a2235', borderRadius: '12px', color: '#9ca3af' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
            <p>No hay partidos {activeTab === 'live' ? 'en vivo' : 'programados'} {selectedLeague ? 'para esta liga' : ''}</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {displayMatches.map((match: any) => (
              <MatchCard
                key={match.fixture.id}
                homeTeam={match.teams.home}
                awayTeam={match.teams.away}
                goals={match.goals}
                status={match.fixture.status.short}
                league={`${match.league.name} — ${match.league.country}`}
                time={activeTab === 'live'
                  ? `${match.fixture.status.elapsed}'`
                  : new Date(match.fixture.date).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}