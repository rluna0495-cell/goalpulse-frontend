'use client';

interface Team {
  name: string;
  logo: string;
}

interface Goals {
  home: number | null;
  away: number | null;
}

interface MatchCardProps {
  homeTeam: Team;
  awayTeam: Team;
  goals?: Goals;
  status: string;
  league: string;
  time?: string;
}

export default function MatchCard({ homeTeam, awayTeam, goals, status, league, time }: MatchCardProps) {
  const isLive = ['1H', '2H', 'HT', 'ET', 'P', 'LIVE'].includes(status);

  return (
    <div style={{
      backgroundColor: '#1a2235',
      borderRadius: '12px',
      padding: '14px 16px',
      border: isLive ? '1px solid #00ff87' : '1px solid #1f2937',
      cursor: 'pointer',
      transition: 'all 0.2s',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <span style={{ fontSize: '11px', color: '#9ca3af', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '60%' }}>
          {league}
        </span>
        {isLive ? (
          <span style={{ backgroundColor: '#dc2626', color: 'white', fontSize: '10px', padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
            🔴 {time}
          </span>
        ) : (
          <span style={{ fontSize: '11px', color: '#9ca3af', whiteSpace: 'nowrap' }}>{time}</span>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* Equipo local */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0 }}>
          <img src={homeTeam.logo} alt={homeTeam.name}
            style={{ width: '28px', height: '28px', objectFit: 'contain', flexShrink: 0 }}
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
          <span style={{ fontSize: '14px', fontWeight: '600', color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {homeTeam.name}
          </span>
        </div>

        {/* Marcador */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          padding: '6px 12px', backgroundColor: '#0a0e1a', borderRadius: '8px',
          flexShrink: 0,
        }}>
          <span style={{ fontSize: '18px', fontWeight: 'bold', color: isLive ? '#00ff87' : 'white', minWidth: '16px', textAlign: 'center' }}>
            {goals?.home ?? '-'}
          </span>
          <span style={{ color: '#9ca3af', fontSize: '14px' }}>:</span>
          <span style={{ fontSize: '18px', fontWeight: 'bold', color: isLive ? '#00ff87' : 'white', minWidth: '16px', textAlign: 'center' }}>
            {goals?.away ?? '-'}
          </span>
        </div>

        {/* Equipo visitante */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, justifyContent: 'flex-end', minWidth: 0 }}>
          <span style={{ fontSize: '14px', fontWeight: '600', color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'right' }}>
            {awayTeam.name}
          </span>
          <img src={awayTeam.logo} alt={awayTeam.name}
            style={{ width: '28px', height: '28px', objectFit: 'contain', flexShrink: 0 }}
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        </div>
      </div>
    </div>
  );
}