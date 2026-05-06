'use client';

const COUNTRIES = [
  { name: 'España', flag: '🇪🇸', leagues: ['LaLiga', 'Segunda División', 'Copa del Rey'] },
  { name: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', leagues: ['Premier League', 'Championship', 'FA Cup'] },
  { name: 'Italia', flag: '🇮🇹', leagues: ['Serie A', 'Serie B', 'Coppa Italia'] },
  { name: 'Alemania', flag: '🇩🇪', leagues: ['Bundesliga', '2. Bundesliga'] },
  { name: 'Colombia', flag: '🇨🇴', leagues: ['Primera A', 'Copa Colombia'] },
  { name: 'Argentina', flag: '🇦🇷', leagues: ['Liga Profesional', 'Copa Argentina'] },
  { name: 'Brasil', flag: '🇧🇷', leagues: ['Brasileirao Seria A', 'Copa do Brasil'] },
  { name: 'México', flag: '🇲🇽', leagues: ['Liga MX', 'Expansión MX'] },
];

export default function Sidebar() {
  return (
    <aside style={{ width: '260px', flexShrink: 0, display: 'none', '@media (min-width: 1024px)': { display: 'block' } } as any}>
      <div style={{ backgroundColor: '#1a2235', borderRadius: '12px', padding: '20px', position: 'sticky', top: '84px', border: '1px solid #1f2937' }}>
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ fontSize: '11px', color: '#4b5563', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '800' }}>
            Mis Ligas ⭐
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ color: '#00ff87', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>Champions League</div>
            <div style={{ color: '#e5e7eb', fontSize: '13px', cursor: 'pointer' }}>Premier League</div>
            <div style={{ color: '#e5e7eb', fontSize: '13px', cursor: 'pointer' }}>LaLiga</div>
          </div>
        </div>

        <div>
          <h3 style={{ fontSize: '11px', color: '#4b5563', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '800' }}>
            Países
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {COUNTRIES.map((country) => (
              <details key={country.name} style={{ width: '100%' }}>
                <summary style={{ 
                  listStyle: 'none', padding: '8px 0', color: '#9ca3af', fontSize: '13px', 
                  cursor: 'pointer', display: 'flex', justifyContent: 'space-between'
                }}>
                  <span>{country.flag} {country.name}</span>
                  <span style={{ fontSize: '10px opacity: 0.5' }}>▼</span>
                </summary>
                <div style={{ paddingLeft: '20px', paddingBottom: '8px' }}>
                  {country.leagues.map(league => (
                    <div key={league} style={{ color: '#6b7280', fontSize: '12px', padding: '4px 0', cursor: 'pointer' }}>
                      {league}
                    </div>
                  ))}
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}