'use client';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';

interface Team {
  name: string;
  logo: string;
}

interface Goals {
  home: number | null;
  away: number | null;
}

interface MatchCardProps {
  id: number; // Lo hacemos obligatorio para la navegación y favoritos
  homeTeam: Team;
  awayTeam: Team;
  goals: Goals;
  status: string;
  league: string;
  time?: string;
}

export default function MatchCard({ id, homeTeam, awayTeam, goals, status, league, time }: MatchCardProps) {
  const router = useRouter();
  const isLive = ['1H', '2H', 'HT', 'ET', 'P', 'LIVE'].includes(status);

  const [goalFlash, setGoalFlash] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const prevGoalsRef = useRef<Goals>(goals);

  // Lógica de Favoritos
  useEffect(() => {
    const favs = JSON.parse(localStorage.getItem('goalpulse_favs') || '[]');
    setIsFavorite(favs.includes(id));
  }, [id]);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    const favs = JSON.parse(localStorage.getItem('goalpulse_favs') || '[]');
    const newFavs = favs.includes(id) 
      ? favs.filter((fid: number) => fid !== id) 
      : [...favs, id];
    
    localStorage.setItem('goalpulse_favs', JSON.stringify(newFavs));
    setIsFavorite(!isFavorite);
    window.dispatchEvent(new Event('favorites_changed'));
  };

  // Efecto de Flash cuando hay GOL
  useEffect(() => {
    if (isLive && prevGoalsRef.current) {
      const homeChanged = goals.home !== prevGoalsRef.current.home;
      const awayChanged = goals.away !== prevGoalsRef.current.away;

      if (homeChanged || awayChanged) {
        setGoalFlash(true);
        const timer = setTimeout(() => setGoalFlash(false), 3000); // 3 segundos de brillo
        return () => clearTimeout(timer);
      }
    }
    prevGoalsRef.current = goals;
  }, [goals, isLive]);

  return (
    <>
      <style jsx>{`
        @keyframes live-pulse {
          0% { opacity: 1; }
          50% { opacity: 0.4; }
          100% { opacity: 1; }
        }
        @keyframes goal-glow {
          0% { box-shadow: 0 0 0px rgba(0, 255, 135, 0); }
          50% { box-shadow: 0 0 20px rgba(0, 255, 135, 0.4); border-color: #00ff87; }
          100% { box-shadow: 0 0 0px rgba(0, 255, 135, 0); }
        }
        .match-card {
          transition: transform 0.2s, background-color 0.2s;
        }
        .match-card:hover {
          transform: translateY(-2px);
          background-color: #242f47 !important;
        }
        .goal-active {
          animation: goal-glow 1s ease infinite;
          background-color: rgba(0, 255, 135, 0.05) !important;
        }
      `}</style>

      <div
        className={`match-card ${goalFlash ? 'goal-active' : ''}`}
        onClick={() => router.push(`/match/${id}`)}
        style={{
          backgroundColor: '#1a2235',
          borderRadius: '12px',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          cursor: 'pointer',
          border: isLive ? '1px solid #00ff87' : '1px solid #2d3748',
          position: 'relative',
          marginBottom: '8px'
        }}
      >
        {/* Favorito Star */}
        <div 
          onClick={toggleFavorite}
          style={{
            position: 'absolute', left: '8px', top: '16px',
            color: isFavorite ? '#00ff87' : '#4a5568',
            fontSize: '18px', zIndex: 5
          }}
        >
          {isFavorite ? '★' : '☆'}
        </div>

        {/* Header: League & Time */}
        <div style={{ display: 'flex', justifyContent: 'space-between', paddingLeft: '24px' }}>
          <span style={{ fontSize: '12px', color: '#a0aec0', fontWeight: '500' }}>{league}</span>
          <span style={{ 
            fontSize: '12px', 
            color: isLive ? '#ff4d4d' : '#a0aec0', 
            fontWeight: 'bold',
            animation: isLive ? 'live-pulse 2s infinite' : 'none'
          }}>
            {isLive && '• '}{time}
          </span>
        </div>

        {/* Body: Teams & Score */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingLeft: '24px' }}>
          {/* Home Team */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
            <img src={homeTeam.logo} alt="" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
            <span style={{ color: 'white', fontWeight: '600', fontSize: '14px' }}>{homeTeam.name}</span>
          </div>

          {/* Score Box */}
          <div style={{ 
            display: 'flex', gap: '8px', backgroundColor: '#0f172a', 
            padding: '6px 16px', borderRadius: '8px', border: '1px solid #2d3748' 
          }}>
            <span style={{ color: isLive ? '#00ff87' : 'white', fontSize: '20px', fontWeight: '800' }}>
              {goals.home ?? 0}
            </span>
            <span style={{ color: '#4a5568', fontSize: '20px', fontWeight: '800' }}>:</span>
            <span style={{ color: isLive ? '#00ff87' : 'white', fontSize: '20px', fontWeight: '800' }}>
              {goals.away ?? 0}
            </span>
          </div>

          {/* Away Team */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, justifyContent: 'flex-end' }}>
            <span style={{ color: 'white', fontWeight: '600', fontSize: '14px', textAlign: 'right' }}>{awayTeam.name}</span>
            <img src={awayTeam.logo} alt="" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
          </div>
        </div>

        {/* Footer: Odds (Simuladas para estilo Flashscore) */}
        <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid #2d3748', paddingTop: '10px' }}>
          <div style={{ flex: 1, textAlign: 'center', fontSize: '11px', color: '#718096', background: '#1e293b', padding: '4px', borderRadius: '4px' }}>
            1 <span style={{ color: '#63b3ed', marginLeft: '4px' }}>2.10</span>
          </div>
          <div style={{ flex: 1, textAlign: 'center', fontSize: '11px', color: '#718096', background: '#1e293b', padding: '4px', borderRadius: '4px' }}>
            X <span style={{ color: '#63b3ed', marginLeft: '4px' }}>3.40</span>
          </div>
          <div style={{ flex: 1, textAlign: 'center', fontSize: '11px', color: '#718096', background: '#1e293b', padding: '4px', borderRadius: '4px' }}>
            2 <span style={{ color: '#63b3ed', marginLeft: '4px' }}>3.20</span>
          </div>
        </div>
      </div>
    </>
  );
}