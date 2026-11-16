"use client";
import { formatCurrency, formatNumber } from '../../../lib/utils';

export default function DashboardPage() {
    const metrics = [
        { label: 'Total Active Models', value: '14', status: 'Healthy' },
        { label: 'Automated Price Updates (24h)', value: formatNumber(18492), status: '+12% vs yesterday' },
        { label: 'Est. Margin Optimization', value: formatCurrency(42500), status: '+2.4% yield' },
    ];

    return (
        <div>
            <h1 className="page-title">System Dashboard</h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
                {metrics.map((m, i) => (
                    <div key={i} className="card">
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: '500' }}>{m.label}</p>
                        <p style={{ fontSize: '1.75rem', fontWeight: '700', marginTop: '0.5rem' }}>{m.value}</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--success)', marginTop: '0.5rem', fontWeight: '500' }}>{m.status}</p>
                    </div>
                ))}
            </div>

            <div className="card">
                <h2 className="section-title">Recent Autonomous Adjustments</h2>
                <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                    <thead>
                    <tr style={{ borderBottom: '2px solid var(--border)', color: 'var(--text-muted)' }}>
                        <th style={{ padding: '0.75rem 0' }}>Product ID</th>
                        <th>Old Price</th>
                        <th>New Price</th>
                        <th>Trigger</th>
                        <th>Confidence</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '1rem 0', fontWeight: '500' }}>SKU-891 (Sony WH-1000XM5)</td>
                        <td>$348.00</td>
                        <td style={{ color: 'var(--success)', fontWeight: '600' }}>$342.50</td>
                        <td>Competitor Drop (-1.5%)</td>
                        <td>94%</td>
                    </tr>
                    <tr>
                        <td style={{ padding: '1rem 0', fontWeight: '500' }}>SKU-772 (Logitech MX Master 3S)</td>
                        <td>$95.00</td>
                        <td style={{ color: 'var(--primary)', fontWeight: '600' }}>$99.00</td>
                        <td>Inventory Scarcity</td>
                        <td>88%</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}