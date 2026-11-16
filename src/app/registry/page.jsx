export default function Registry() {
    return (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'white', borderRadius: '8px' }}>
            <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>🎁</div>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>ShopSmart Registry & Gifts</h1>
            <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 2rem auto' }}>
                Celebrate life's biggest moments. Create a registry for your wedding, baby, or special occasion.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button className="btn" style={{ width: 'auto', padding: '0.75rem 2rem' }}>Create a Registry</button>
                <button className="btn" style={{ width: 'auto', padding: '0.75rem 2rem', background: '#f3f3f3', border: '1px solid var(--border)' }}>Find a Registry</button>
            </div>
        </div>
    );
}