export default function GiftCards() {
    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Gift Cards</h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                {['Birthday', 'Thank You', 'Congratulations'].map((occasion, i) => (
                    <div key={i} style={{ background: 'white', padding: '2rem', borderRadius: '8px', border: '1px solid var(--border)', textAlign: 'center' }}>
                        <div style={{ height: '150px', background: '#131921', color: 'white', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                            ShopSmart
                        </div>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{occasion} eGift Card</h3>
                        <p style={{ color: 'var(--link)', fontSize: '0.875rem', marginBottom: '1rem' }}>Email or Text delivery</p>
                        <button className="btn">Select Design</button>
                    </div>
                ))}
            </div>
        </div>
    );
}