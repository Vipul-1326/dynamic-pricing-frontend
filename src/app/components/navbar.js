"use client";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function Navbar() {
    const [search, setSearch] = useState('');
    const [user, setUser] = useState(null);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const storedUser = sessionStorage.getItem('authUser');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else if (pathname !== '/login' && pathname !== '/register') {
            // Redirect to login when entering the website if not authenticated
            router.push('/login');
        }
    }, [pathname, router]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (search.trim()) router.push(`/?search=${encodeURIComponent(search)}`);
        else router.push(`/`);
    };

    const handleSignOut = () => {
        sessionStorage.removeItem('authUser');
        setUser(null);
        router.push('/login');
    };

    return (
        <>
            <nav className="nav-container">
                <Link href="/" className="nav-logo">ShopSmart</Link>

                <form className="nav-search" onSubmit={handleSearch}>
                    <select><option>All Electronics</option></select>
                    <input
                        type="text"
                        placeholder="Search electronics, laptops, smart home..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button type="submit">🔍</button>
                </form>

                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    {user ? (
                        <div className="nav-link" onClick={handleSignOut} style={{ cursor: 'pointer' }}>
                            <span style={{ fontSize: '0.75rem' }}>Hello, {user.fullName.split(' ')[0]}</span>
                            <span style={{ fontSize: '0.875rem', fontWeight: 'bold' }}>Sign Out</span>
                        </div>
                    ) : (
                        <Link href="/login" className="nav-link">
                            <span style={{ fontSize: '0.75rem' }}>Hello, Guest</span>
                            <span style={{ fontSize: '0.875rem', fontWeight: 'bold' }}>Sign In</span>
                        </Link>
                    )}

                    <Link href="/orders" className="nav-link">
                        <span style={{ fontSize: '0.75rem' }}>Returns</span>
                        <span style={{ fontSize: '0.875rem', fontWeight: 'bold' }}>& Orders</span>
                    </Link>
                    <Link href="/cart" className="nav-link" style={{ flexDirection: 'row', alignItems: 'end', gap: '0.25rem' }}>
                        <span style={{ fontSize: '2rem', lineHeight: '1' }}>🛒</span>
                        <span style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#f08804' }}>Cart</span>
                    </Link>
                </div>
            </nav>
            <div className="nav-sub">
                <span style={{ fontWeight: 'bold' }}>☰ All</span>
                <Link href="/deals" style={{ color: 'white', textDecoration: 'none' }}>Today's Deals</Link>
                <Link href="/service" style={{ color: 'white', textDecoration: 'none' }}>Customer Service</Link>
                <Link href="/registry" style={{ color: 'white', textDecoration: 'none' }}>Registry</Link>
                <Link href="/giftcards" style={{ color: 'white', textDecoration: 'none' }}>Gift Cards</Link>
                <Link href="/sell" style={{ color: 'white', textDecoration: 'none' }}>Sell</Link>
            </div>
        </>
    );
}