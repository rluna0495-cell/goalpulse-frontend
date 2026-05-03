'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '../../components/Navbar';
import { footballApi } from '../../lib/api';

export default function MatchPage() {
  const params = useParams();
  const [match, setMatch] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatch = async () => {
      try {
        const res = await footballApi.getMatch(Number(params.id));
        setMatch(res.data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchMatch();
  }, [params.id]);

  if (loading) return (
    <main style={{ minHeight: '100vh', backgroundColor: '#0a0e1a' }}>
      <Navbar />
      <div style={{ textAlign: 'center', padding: '80px', color: '#9ca3af' }}>
        <div style={{ fontSize: '48px' }}>⚽</div>
        <p>Cargando partido...</p>
      </div>
    </main>
  );

  if (!match) return (
    <main style={{ minHeight: '100vh', backgroundColor: '#0a0e1a' }}>
      <Navbar />
      <div style={{ textAlign: 'center', padding: '80px', color: '#9ca3af' }}>
        <p>Partido no encontrado</p>
      </div>
    </main>
  );

  const isLive = ['1H', '2H', 'HT', 'ET', 'P'].includes(match.fixture?.status?.short);

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#0a0e1a' }}>
      <Navbar />
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 24px' }}>

        {/* Liga */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
          <img src={match.league?.logo} alt="" style={{ width: '24px', height: '24px', objectFit: 'contain' }} />
          <span style={{ color: '#9ca3af', fontSize: '14px' }}>{match.league?.name} — {match.league?.country}</span>
          {isLive && (
            <span style={{ backgroundColor: '#dc2626', color: 'white', fontSize: '11px', padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold', marginLeft: 'auto' }}>
              🔴 EN VIVO — {match.fixture?.status?.elapsed}'
            </span>
          )}
        </div>

        {/* Marcador principal */}
        <div style={{
          backgroundColor: '#1a2235', borderRadius: '16px', padding: '32px',
          border: isLive ? '1px solid #00ff87' : '1px solid #1f2937',
          marginBottom: '24px', textAlign: 'center',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '24px' }}>
            <div style={{ flex: 1, textAlign: 'center' }}>
              <img src={match.teams?.home?.logo} alt={match.teams?.home?.name}
                style={{ width: '72px', height: '72px', objectFit: 'contain', marginBottom: '12px' }} />
              <div style={{ fontSize: '18px', fontWeight: '700', color: 'white' }}>{match.teams?.home?.name}</div>
              <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>Local</div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '56px', fontWeight: '900', color: isLive ? '#00ff87' : 'white' }}>
                {match.goals?.home ?? '0'} : {match.goals?.away ?? '0'}
              </div>
              <div style={{ fontSize: '13px', color: '#9ca3af', marginTop: '4px' }}>
                {match.fixture?.status?.long}
              </div>
            </div>

            <div style={{ flex: 1, textAlign: 'center' }}>
              <img src={match.teams?.away?.logo} alt={match.teams?.away?.name}
                style={{ width: '72px', height: '72px', objectFit: 'contain', marginBottom: '12px' }} />
              <div style={{ fontSize: '18px', fontWeight: '700', color: 'white' }}>{match.teams?.away?.name}</div>
              <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>Visitante</div>
            </div>
          </div>
        </div>

        {/* Estadísticas */}
        {match.statistics && match.statistics.length > 0 && (
          <div style={{ backgroundColor: '#1a2235', borderRadius: '16px', padding: '24px', border: '1px solid #1f2937', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: 'white', marginBottom: '20px' }}>📊 Estadísticas</h2>
            {match.statistics[0]?.statistics?.map((stat: any, index: number) => {
              const homeStat = match.statistics[0]?.statistics[index]?.value || 0;
              const awayStat = match.statistics[1]?.statistics[index]?.value || 0;
              const homeVal = parseInt(homeStat) || 0;
              const awayVal = parseInt(awayStat) || 0;
              const total = homeVal + awayVal || 1;
              const homePercent = Math.round((homeVal / total) * 100);
              const awayPercent = 100 - homePercent;

              return (
                <div key={index} style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: '#00ff87' }}>{homeStat}</span>
                    <span style={{ fontSize: '12px', color: '#9ca3af' }}>{stat.type}</span>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: '#3b82f6' }}>{awayStat}</span>
                  </div>
                  <div style={{ display: 'flex', height: '6px', borderRadius: '3px', overflow: 'hidden', backgroundColor: '#0a0e1a' }}>
                    <div style={{ width: `${homePercent}%`, backgroundColor: '#00ff87', transition: 'width 0.3s' }} />
                    <div style={{ width: `${awayPercent}%`, backgroundColor: '#3b82f6', transition: 'width 0.3s' }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Eventos del partido */}
        {match.events && match.events.length > 0 && (
          <div style={{ backgroundColor: '#1a2235', borderRadius: '16px', padding: '24px', border: '1px solid #1f2937' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: 'white', marginBottom: '20px' }}>📋 Eventos</h2>
            {match.events.map((event: any, index: number) => {
              const isHome = event.team?.id === match.teams?.home?.id;
              const icon = event.type === 'Goal' ? '⚽' : event.type === 'Card' ? (event.detail === 'Yellow Card' ? '🟨' : '🟥') : event.type === 'subst' ? '🔄' : '📌';

              return (
                <div key={index} style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '10px 0', borderBottom: '1px solid #1f2937',
                  flexDirection: isHome ? 'row' : 'row-reverse',
                }}>
                  <span style={{ fontSize: '12px', color: '#9ca3af', minWidth: '30px', textAlign: 'center' }}>
                    {event.time?.elapsed}'
                  </span>
                  <span style={{ fontSize: '20px' }}>{icon}</span>
                  <div style={{ flex: 1, textAlign: isHome ? 'left' : 'right' }}>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: 'white' }}>{event.player?.name}</div>
                    <div style={{ fontSize: '12px', color: '#9ca3af' }}>{event.detail}</div>
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