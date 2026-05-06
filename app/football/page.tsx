'use client';
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar'; // Import Sidebar
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

const MOCK_DATA = [
  {
    fixture: { id: 1, status: { short: 'LIVE', elapsed: 72 }, date: new Date().toISOString() },
    teams: {
      home: { name: 'Real Madrid', logo: 'https://media.api-sports.io/football/teams/541.png' },
      away: { name: 'Barcelona', logo: 'https://media.api-sports.io/football/teams/529.png' }
    },
    goals: { home: 3, away: 2 },
    league: { id: 140, name: 'LaLiga', country: 'España', logo: 'https://media.api-sports.io/football/leagues/140.png' }
  },
  {
    fixture: { id: 2, status: { short: '2H', elapsed: 88 }, date: new Date().toISOString() },
    teams: {
      home: { name: 'Liverpool', logo: 'https://media.api-sports.io/football/teams/40.png' },
      away: { name: 'Man City', logo: 'https://media.api-sports.io/football/teams/50.png' }
    },
    goals: { home: 1, away: 1 },
    league: { id: 39, name: 'Premier League', country: 'Inglaterra', logo: 'https://media.api-sports.io/football/leagues/39.png' }
  }
];

// Helpers para el manejo de fechas (Banda de Calendario)
const getNormalizedDate = (date: Date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

const formatDate = (date: Date) => {
  const today = getNormalizedDate(new Date());
  const target = getNormalizedDate(date);
  if (today.getTime() === target.getTime()) return 'Hoy';
  if (target.getTime() === today.getTime() - 86400000) return 'Ayer';
  if (target.getTime() === today.getTime() + 86400000) return 'Mañ.';
  return target.toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit' });
};

export default function FootballPage() {
  const [liveMatches, setLiveMatches] = useState<any[]>([]);
  const [todayMatches, setTodayMatches] = useState<any[]>([]);
  const [selectedLeague, setSelectedLeague] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'live' | 'today'>('live');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date>(getNormalizedDate(new Date()));

  const adjustDate = (offset: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + offset);
    setSelectedDate(getNormalizedDate(newDate));
  };

  useEffect(() => {
    fetchMatches();

    const socket = new WebSocket('ws://localhost:3001');

    socket.onmessage = () => {
      fetchMatches(false); // Actualización silenciosa
    };

    const interval = setInterval(() => fetchMatches(false), 30000);
    return () => {
      clearInterval(interval);
      socket.close();
    };
  }, [selectedLeague, selectedDate]);

  const fetchMatches = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      
      const dateString = selectedDate.toISOString().split('T')[0];

      const [liveRes, todayRes] = await Promise.all([
        footballApi.getLive(dateString),
        footballApi.getToday(dateString),
      ]);
      
      let live = Array.isArray(liveRes.data) ? liveRes.data : (liveRes.data.data || []);
      let today = Array.isArray(todayRes.data) ? todayRes.data : (todayRes.data.data || []);

      if (live.length === 0 && today.length === 0) {
        live = MOCK_DATA;
        today = MOCK_DATA;
      }

      setLiveMatches(live);
      setTodayMatches(today);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const rawMatches = activeTab === 'live' ? liveMatches : todayMatches;
  
  // Filtrado por Liga y Término de Búsqueda (País, Liga o Equipo)
  const filteredMatches = rawMatches.filter((m: any) => {
    const matchesLeague = selectedLeague ? Number(m.league.id) === Number(selectedLeague) : true;
    const matchesSearch = searchTerm 
      ? m.league.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        m.league.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.teams.home.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.teams.away.name.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    return matchesLeague && matchesSearch;
  });

  const groupedMatches = filteredMatches.reduce((acc: any, match: any) => {
    const key = `${match.league.country} - ${match.league.name}`;
    if (!acc[key]) acc[key] = { info: match.league, matches: [] };
    acc[key].matches.push(match);
    return acc;
  }, {});

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#0a0e1a' }}>
      <Navbar />
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
        <h1 style={{
          fontSize: '32px', fontWeight: 'bold', marginBottom: '24px',
          background: 'linear-gradient(90deg, #00ff87, #3b82f6)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>⚽ Fútbol Mundial</h1>

        {/* Buscador Profesional */}
        <div style={{ position: 'relative', marginBottom: '24px' }}>
          <input
            type="text"
            placeholder="🔍 Buscar país, liga o equipo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '14px 16px 14px 16px',
              borderRadius: '12px',
              backgroundColor: '#1a2235',
              border: '1px solid #1f2937',
              color: 'white',
              fontSize: '15px',
              outline: 'none',
              transition: 'border-color 0.2s',
            }}
          />
        </div>

        {/* Date Slider (Banda de Calendario) */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', backgroundColor: '#1a2235', borderRadius: '10px', padding: '8px', border: '1px solid #1f2937' }}>
          <button onClick={() => adjustDate(-1)} style={{ background: 'none', border: 'none', color: '#9ca3af', fontSize: '20px', cursor: 'pointer', padding: '0 10px' }}>{'<'}</button>
          
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', scrollbarWidth: 'none', flexGrow: 1, justifyContent: 'center' }}>
            {[-1, 0, 1, 2, 3].map(dayOffset => { // Show yesterday, today, tomorrow, and next 2 days
              const date = new Date();
              date.setDate(date.getDate() + dayOffset);
              const normalizedDate = getNormalizedDate(date);
              const isActive = getNormalizedDate(selectedDate).getTime() === normalizedDate.getTime();

              return (
                <button
                  key={dayOffset}
                  onClick={() => setSelectedDate(normalizedDate)}
                  style={{
                    padding: '8px 16px', borderRadius: '8px', border: 'none',
                    backgroundColor: isActive ? '#3b82f6' : 'transparent',
                    color: isActive ? 'white' : '#9ca3af',
                    cursor: 'pointer', fontSize: '13px', fontWeight: '600',
                    whiteSpace: 'nowrap', minWidth: '80px', textAlign: 'center',
                    transition: 'all 0.2s'
                  }}
                >
                  {formatDate(normalizedDate)}
                </button>
              );
            })}
          </div>

          <button onClick={() => adjustDate(1)} style={{ background: 'none', border: 'none', color: '#9ca3af', fontSize: '20px', cursor: 'pointer', padding: '0 10px' }}>{'>'}</button>
        </div>

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

        <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start' }}>
          <Sidebar /> {/* Add Sidebar here */}
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', backgroundColor: '#1a2235', borderRadius: '10px', padding: '4px', width: 'fit-content' }}>
              {(['live', 'today'] as const).map((tab) => {
                const isActive = activeTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    style={{
                      padding: '8px 24px',
                      borderRadius: '8px',
                      border: 'none',
                      backgroundColor: isActive ? '#3b82f6' : 'transparent',
                      color: isActive ? 'white' : '#9ca3af',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '600',
                      transition: 'all 0.2s',
                    }}
                  >
                    {tab === 'live' ? `🔴 En Vivo (${liveMatches.length})` : `📅 Próximos (${todayMatches.length})`}
                  </button>
                );
              })}
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '80px', color: '#9ca3af' }}>
                <div style={{ fontSize: '48px' }}>⚽</div>
                <p>Cargando partidos...</p>
              </div>
            ) : Object.keys(groupedMatches).length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px', backgroundColor: '#1a2235', borderRadius: '12px', color: '#9ca3af' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
                <p>No se encontraron partidos para "{searchTerm || 'esta liga'}"</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                {Object.entries(groupedMatches).map(([groupName, data]: any) => (
                  <div key={groupName}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 0', borderBottom: '1px solid #1f2937', marginBottom: '12px' }}>
                      <img src={data.info.logo} style={{ width: '20px', height: '20px', objectFit: 'contain' }} alt="" />
                      <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '14px' }}>{groupName.toUpperCase()}</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {data.matches.map((match: any) => (
                        <MatchCard
                          key={match.fixture.id}
                          id={match.fixture.id}
                          homeTeam={match.teams.home}
                          awayTeam={match.teams.away}
                          goals={match.goals}
                          status={match.fixture.status.short}
                          league={data.info.name}
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
        </div>
      </div>
    </main>
  );
}