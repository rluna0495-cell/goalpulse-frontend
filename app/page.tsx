'use client';
import { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import Navbar from './components/Navbar';
import MatchCard from './components/MatchCard';
import Link from 'next/link';
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
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Inicializar sonido de gol (Asegúrate de tener public/goal.mp3)
    audioRef.current = new Audio('/goal.mp3');

    // Carga inicial
    fetchData(true);

    // Configuración de Socket.io
    // Usa 'http://localhost:3001' si estás en local o tu URL de Railway
    const socket = io('http://localhost:3001');

    socket.on('scoreUpdate', (updatedMatch) => {
      console.log('⚽ Evento recibido:', updatedMatch.updateType);
      
      // Si el backend detectó un GOL, suena la alerta
      if (updatedMatch.updateType === 'GOAL') {
        audioRef.current?.play().catch(() => console.log("Audio bloqueado por el navegador"));
      }

      // Actualizamos el estado local sin recargar todo
      setLiveMatches((prev) => {
        const exists = prev.find(m => m.fixture.id === updatedMatch.fixture.id);
        if (!exists) return [updatedMatch, ...prev]; // Si no estaba y empezó a jugar
        return prev.map(m => m.fixture.id === updatedMatch.fixture.id ? updatedMatch : m);
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const fetchData = async (initial = false) => {
    try {
      if (initial) setLoading(true);
      const [liveRes, todayRes] = await Promise.all([
        footballApi.getLive(),
        footballApi.getToday(),
      ]);
      
      setLiveMatches(liveRes.data.data || []);
      setTodayMatches(todayRes.data.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const displayMatches = activeTab === 'live' ? liveMatches : todayMatches;

  // Agrupar por liga para el diseño tipo Flashscore
  const groupedByLeague = displayMatches.reduce((acc: any, match: any) => {
    const leagueName = match.league.name;
    if (!acc[leagueName]) acc[leagueName] = { info: match.league, matches: [] };
    acc[leagueName].matches.push(match);
    return acc;
  }, {});

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#0a0e1a' }}>
      <Navbar />

      {/* Hero Section */}
      <div style={{
        background: 'radial-gradient(circle at top, #1a2235 0%, #0a0e1a 100%)',
        padding: '60px 24px 40px',
        textAlign: 'center',
        borderBottom: '1px solid #1f2937',
      }}>
        <h1 style={{
          fontSize: '56px', fontWeight: '900', marginBottom: '16px',
          background: 'linear-gradient(90deg, #00ff87, #3b82f6, #00ff87)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>GoalPulse</h1>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '60px' }}>
          {[
            { label: 'En Vivo', value: liveMatches.length, color: '#ff4d4d' },
            { label: 'Hoy', value: todayMatches.length, color: '#3b82f6' },
            { label: 'Ligas', value: TOP_LEAGUES.length + '+', color: '#00ff87' },
          ].map((stat) => (
            <div key={stat.label}>
              <div style={{ fontSize: '36px', fontWeight: 'bold', color: stat.color }}>{stat.value}</div>
              <div style={{ fontSize: '13px', color: '#9ca3af' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '32px 24px' }}>
        
        {/* Filtro de Tabs */}
        <div style={{ display: 'flex', gap: '4px', marginBottom: '32px', backgroundColor: '#1a2235', borderRadius: '10px', padding: '4px', width: 'fit-content' }}>
          {(['live', 'today'] as const).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              padding: '10px 28px', borderRadius: '8px', border: 'none',
              backgroundColor: activeTab === tab ? '#3b82f6' : 'transparent',
              color: activeTab === tab ? 'white' : '#9ca3af',
              cursor: 'pointer', fontSize: '14px', fontWeight: '600', transition: 'all 0.2s'
            }}>
              {tab === 'live' ? `🔴 EN VIVO` : `📅 PARTIDOS DE HOY`}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px', color: '#9ca3af' }}>
            <p>Sincronizando con el campo de juego...</p>
          </div>
        ) : Object.keys(groupedByLeague).length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', backgroundColor: '#1a2235', borderRadius: '12px', color: '#9ca3af' }}>
            <p>No hay partidos {activeTab === 'live' ? 'en vivo' : 'hoy'}.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {Object.entries(groupedByLeague).map(([leagueName, leagueData]: any) => (
              <div key={leagueName}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  marginBottom: '16px', padding: '8px 0', borderBottom: '1px solid #1f2937'
                }}>
                  <img src={leagueData.info.logo} alt="" style={{ width: '20px', height: '20px', objectFit: 'contain' }} />
                  <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#00ff87' }}>{leagueName.toUpperCase()}</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {leagueData.matches.map((match: any) => (
                    <MatchCard
                      key={match.fixture.id}
                      id={match.fixture.id}
                      homeTeam={match.teams.home}
                      awayTeam={match.teams.away}
                      goals={match.goals}
                      status={match.fixture.status.short}
                      league={leagueName}
                      time={activeTab === 'live' ? `${match.fixture.status.elapsed}'` : new Date(match.fixture.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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