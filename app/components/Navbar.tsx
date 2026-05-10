'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav style={{
      backgroundColor: '#070d1a',
      borderBottom: '1px solid #1a2a4a',
      padding: '0 24px',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backdropFilter: 'blur(10px)',
    }}>
      <div style={{
        maxWidth: '1200px', margin: '0 auto',
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', height: '60px',
      }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <span style={{
            fontSize: '22px', fontWeight: '900',
            background: 'linear-gradient(90deg, #00ff87, #3b82f6)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>⚡ GoalPulse</span>
        </Link>

        <div style={{ display: 'flex', gap: '4px' }}>
          {[
            { label: '🔴 En Vivo', href: '/' },
            { label: '⚽ Ligas', href: '/football' },
            { label: '🏆 Standings', href: '/standings' },
          ].map((item) => (
            <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
              <span style={{
                padding: '6px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: '600',
                color: pathname === item.href ? '#00ff87' : '#6b7fa3',
                backgroundColor: pathname === item.href ? 'rgba(0,255,135,0.1)' : 'transparent',
                border: pathname === item.href ? '1px solid rgba(0,255,135,0.2)' : '1px solid transparent',
                cursor: 'pointer', transition: 'all 0.2s',
              }}>
                {item.label}
              </span>
            </Link>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#00ff87', boxShadow: '0 0 6px #00ff87' }} />
          <span style={{ fontSize: '12px', color: '#6b7fa3' }}>Sistema activo</span>
        </div>
      </div>
    </nav>
  );
}