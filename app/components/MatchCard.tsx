'use client';
import { useRouter } from 'next/navigation';

interface Team {
  name: string;
  logo: string;
}

interface Goals {
  home: number | null;
  away: number | null;
}

interface MatchCardProps {
  id?: number;
  homeTeam: Team;
  awayTeam: Team;
  goals?: Goals;
  status: string;
  league: string;
  time?: string;
}

export default function MatchCard({ id, homeTeam, awayTeam, goals, status, league, time }: MatchCardProps) {
  const router = useRouter();
  const isLive = ['1H', '2H', 'HT', 'ET', 'P', 'LIVE'].includes(status);

  return (
    <div
      onClick={() => id && router.push(`/match/${id}`)}
      style={{
        backgroundColor: isLive ? 'rgba(0,255,135,0.03)' : 'transparent',
        borderRadius: '10px',
        padding: '12px 14px',
        border: isLive ? '1px solid rgba(0,255,135,0.15)' : '1px solid transparent',
        cursor: id ? 'pointer' : 'default',
        transition: 'all 0.2s',
        marginBottom: '4px',
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.backgroundColor = 'rgba(255,255,255,0.03)'; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.backgroundColor = isLive ? 'rgba(0,255,135,0.03)' : 'transparent'; }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Tiempo */}
        <div style={{ width: '48px', textAlign: 'center', flexShrink: 0 }}>
          {isLive ? (
            <div>
              <div style={{ fontSize: '11px', color: '#dc2626', fontWeight: '700' }}>{time}</div>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#dc2626', margin: '2px auto', boxShadow: '0 0 4px #dc2626' }} />
            </div>
          ) : (
            <span style={{ fontSize: '12px', color: '#6b7fa3' }}>{time}</span>
          )}
        </div>

        {/* Equipos y marcador */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Local */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0 }}>
            <img src={homeTeam.logo} alt={homeTeam.name}
              style={{ width: '24px', height: '24px', objectFit: 'contain', flexShrink: 0 }}
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
            <span style={{ fontSize: '14px', fontWeight: '600', color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {homeTeam.name}
            </span>
          </div>

          {/* Marcador */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            backgroundColor: '#070d1a', borderRadius: '8px',
            padding: '6px 14px', flexShrink: 0, minWidth: '80px', justifyContent: 'center',
            border: isLive ? '1px solid rgba(0,255,135,0.2)' : '1px solid #1a2a4a',
          }}>
            <span style={{ fontSize: '16px', fontWeight: '800', color: isLive ? '#00ff87' : 'white', minWidth: '14px', textAlign: 'center' }}>
              {goals?.home ?? '-'}
            </span>
            <span style={{ color: '#4a5a7a', fontSize: '12px' }}>—</span>
            <span style={{ fontSize: '16px', fontWeight: '800', color: isLive ? '#00ff87' : 'white', minWidth: '14px', textAlign: 'center' }}>
              {goals?.away ?? '-'}
            </span>
          </div>

          {/* Visitante */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, justifyContent: 'flex-end', minWidth: 0 }}>
            <span style={{ fontSize: '14px', fontWeight: '600', color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'right' }}>
              {awayTeam.name}
            </span>
            <img src={awayTeam.logo} alt={awayTeam.name}
              style={{ width: '24px', height: '24px', objectFit: 'contain', flexShrink: 0 }}
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          </div>
        </div>

        {/* Flecha */}
        {id && <span style={{ color: '#4a5a7a', fontSize: '12px', flexShrink: 0 }}>›</span>}
      </div>
    </div>
  );
}