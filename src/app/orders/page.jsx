"use client";
import { formatCurrency } from '../../../lib/utils'; // 4 levels up
import Link from 'next/link';

export default function Orders() {
    const pastOrders = [
        {
            id: '114-8928374-2938472', date: 'October 10, 2026', total: 229.99, status: 'Arriving Tomorrow by 8 PM',
            item: 'Apple AirPods Pro (2nd Generation)', image: '🎧', tracking: 75
        },
        {
            id: '113-5847392-1029384', date: 'September 22, 2026', total: 34.99, status: 'Delivered Sept 24',
            item: 'Anker USB-C Hub, 7-in-1', image: '🔌', tracking: 100
        }
    ];

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: '400' }}>Your Orders</h1>
                <div className="nav-search" style={{ border: '1px solid var(--border)', maxWidth: '300px', margin: 0 }}>
                    <input type="text" placeholder="Search all orders" style={{ padding: '0.5rem' }} />
                    <button style={{ padding: '0 1rem', background: '#333', color: 'white' }}>Search</button>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '2rem', borderBottom: '1px solid var(--border)', marginBottom: '1.5rem' }}>
                <span style={{ borderBottom: '2px solid #e47911', paddingBottom: '0.5rem', fontWeight: 'bold', cursor: 'pointer' }}>Orders</span>
                <span style={{ paddingBottom: '0.5rem', color: 'var(--link)', cursor: 'pointer' }}>Buy Again</span>
                <span style={{ paddingBottom: '0.5rem', color: 'var(--link)', cursor: 'pointer' }}>Cancelled Orders</span>
            </div>

            {pastOrders.map((order, i) => (
                <div key={i} className="order-card">
                    <div className="order-header">
                        <div style={{ display: 'flex', gap: '2rem' }}>
                            <div><p>ORDER PLACED</p><p style={{ color: 'var(--text-main)' }}>{order.date}</p></div>
                            <div><p>TOTAL</p><p style={{ color: 'var(--text-main)' }}>{formatCurrency(order.total)}</p></div>
                            <div><p>SHIP TO</p><p style={{ color: 'var(--link)', cursor: 'pointer' }}>Alex Johnson ▾</p></div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <p>ORDER # {order.id}</p>
                            <Link href="#" style={{ color: 'var(--link)', textDecoration: 'none' }}>View order details</Link>
                        </div>
                    </div>

                    <div className="order-body">
                        <div style={{ fontSize: '4rem' }}>{order.image}</div>
                        <div style={{ flex: 1 }}>
                            <h2 style={{ fontSize: '1.125rem', color: order.tracking === 100 ? '#007600' : '#0f1111', marginBottom: '0.5rem' }}>
                                {order.status}
                            </h2>
                            <p style={{ color: 'var(--link)', fontWeight: '500', marginBottom: '1rem' }}>{order.item}</p>

                            {/* Progress bar mock */}
                            <div style={{ height: '10px', background: '#f0f2f2', borderRadius: '5px', overflow: 'hidden', marginBottom: '0.5rem', width: '80%' }}>
                                <div style={{ height: '100%', background: '#007600', width: `${order.tracking}%` }}></div>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button className="btn" style={{ background: '#ffd814', width: 'auto', padding: '0.4rem 1rem' }}>Track package</button>
                                <button className="btn" style={{ background: 'white', width: 'auto', padding: '0.4rem 1rem' }}>View item</button>
                            </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '200px' }}>
                            <button className="btn" style={{ background: 'white', padding: '0.5rem' }}>Leave seller feedback</button>
                            <button className="btn" style={{ background: 'white', padding: '0.5rem' }}>Write a product review</button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}