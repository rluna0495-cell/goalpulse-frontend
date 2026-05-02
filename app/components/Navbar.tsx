'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { label: '⚽ Fútbol', href: '/football' },
  { label: '🏆 Ligas', href: '/football' },
  { label: '📊 Estadísticas', href: '/football' },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav style={{
      backgroundColor: '#111827',
      borderBottom: '1px solid #1f2937',
      padding: '0 24px',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '64px',
      }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <span style={{
            fontSize: '24px', fontWeight: 'bold',
            background: 'linear-gradient(90deg, #00ff87, #3b82f6)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            ⚡ SportsLive
          </span>
        </Link>

        <div style={{ display: 'flex', gap: '8px' }}>
          {navItems.map((item) => (
            <Link key={item.href + item.label} href={item.href} style={{ textDecoration: 'none' }}>
              <span style={{
                padding: '8px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: '500',
                color: pathname === item.href ? '#00ff87' : '#9ca3af',
                backgroundColor: pathname === item.href ? '#1a2235' : 'transparent',
                cursor: 'pointer',
              }}>
                {item.label}
              </span>
            </Link>
          ))}
        </div>

        <div style={{
          padding: '8px 16px', borderRadius: '8px',
          backgroundColor: '#1a2235', color: '#9ca3af', fontSize: '13px',
        }}>
          🔴 En vivo
        </div>
      </div>
    </nav>
  );
}