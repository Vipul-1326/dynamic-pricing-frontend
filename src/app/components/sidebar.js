"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
    const pathname = usePathname();
    if (pathname === '/login') return null; // Hide on login page

    const navItems = [
        { name: 'System Dashboard', path: '/dashboard' },
        { name: 'ML Simulator', path: '/simulator' },
        { name: 'Model Administration', path: '/admin' },
    ];

    return (
        <aside style={{ width: '260px', background: 'var(--sidebar-bg)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '1.5rem', color: 'white', fontSize: '1.25rem', fontWeight: '700', letterSpacing: '0.5px' }}>
                <span style={{ color: 'var(--primary)' }}>Price</span>Pulse
            </div>
            <nav style={{ padding: '1rem', flex: 1 }}>
                {navItems.map((item) => {
                    const isActive = pathname.startsWith(item.path);
                    return (
                        <Link key={item.name} href={item.path} style={{
                            display: 'block', padding: '0.75rem 1rem', marginBottom: '0.25rem', borderRadius: '6px',
                            color: isActive ? 'white' : '#94a3b8', fontSize: '0.875rem', fontWeight: '500', textDecoration: 'none',
                            background: isActive ? 'var(--sidebar-hover)' : 'transparent',
                            borderLeft: isActive ? '3px solid var(--primary)' : '3px solid transparent'
                        }}>
                            {item.name}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}