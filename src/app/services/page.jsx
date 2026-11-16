export default function CustomerService() {
    const topics = [
        { icon: '📦', title: 'A Delivery, Order or Return', desc: 'Track packages, edit orders, or process a return.' },
        { icon: '🔒', title: 'Login & Security', desc: 'Change password, update email.' },
        { icon: '💳', title: 'Payment Options', desc: 'Manage payment methods, balances.' },
        { icon: '👤', title: 'Your Account', desc: 'Manage prime, profiles.' }
    ];

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', background: 'white', padding: '3rem', borderRadius: '8px' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '2rem', textAlign: 'center' }}>Welcome to ShopSmart Customer Service</h1>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>What would you like help with today?</h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
                {topics.map((t, i) => (
                    <div key={i} style={{ border: '1px solid var(--border)', borderRadius: '8px', padding: '1.5rem', display: 'flex', gap: '1rem', cursor: 'pointer' }}>
                        <div style={{ fontSize: '2.5rem' }}>{t.icon}</div>
                        <div>
                            <h3 style={{ fontSize: '1.125rem', marginBottom: '0.25rem' }}>{t.title}</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{t.desc}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '2rem', textAlign: 'center' }}>
                <h3>Need more help?</h3>
                <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', marginBottom: '1rem' }}>Contact our 24/7 support team.</p>
                <button className="btn" style={{ width: 'auto', padding: '0.75rem 2rem' }}>Chat with an Agent</button>
            </div>
        </div>
    );
}