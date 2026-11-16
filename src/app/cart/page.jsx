"use client";
import { formatCurrency } from '../../../lib/utils';

export default function Cart() {
    const mockCart = [
        { id: 'PROD_002', name: 'Logitech MX Master 3S Advanced Wireless Mouse', price: 94.00, quantity: 1, image: '🖱️', stock: 'In Stock' }
    ];
    const savedForLater = [
        { id: 'PROD_004', name: 'Samsung 49" Odyssey G9 Gaming Monitor', price: 1199.99, image: '🖥️' }
    ];

    const subtotal = mockCart.reduce((t, item) => t + (item.price * item.quantity), 0);

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '1.5rem', alignItems: 'start' }}>

            {/* Main Cart Area */}
            <div>
                <div style={{ background: 'var(--surface)', padding: '1.5rem', marginBottom: '1.5rem' }}>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: '400', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>Shopping Cart</h1>

                    {mockCart.map((item, i) => (
                        <div key={i} style={{ display: 'flex', gap: '1.5rem', padding: '1.5rem 0', borderBottom: '1px solid var(--border)' }}>
                            <div style={{ fontSize: '5rem' }}>{item.image}</div>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <h3 style={{ fontSize: '1.125rem', fontWeight: '400', color: 'var(--link)' }}>{item.name}</h3>
                                    <p style={{ fontWeight: '700', fontSize: '1.25rem' }}>{formatCurrency(item.price)}</p>
                                </div>
                                <p style={{ color: '#007600', fontSize: '0.75rem', margin: '0.25rem 0' }}>{item.stock}</p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
                                    <select style={{ padding: '0.4rem', borderRadius: '8px', background: '#f0f2f2' }} defaultValue={item.quantity}>
                                        <option value={1}>Qty: 1</option><option value={2}>Qty: 2</option>
                                    </select>
                                    <span style={{ color: 'var(--border)' }}>|</span>
                                    <button style={{ background: 'none', border: 'none', color: 'var(--link)', cursor: 'pointer' }}>Delete</button>
                                    <span style={{ color: 'var(--border)' }}>|</span>
                                    <button style={{ background: 'none', border: 'none', color: 'var(--link)', cursor: 'pointer' }}>Save for later</button>
                                </div>
                            </div>
                        </div>
                    ))}
                    <div style={{ textAlign: 'right', marginTop: '1rem', fontSize: '1.125rem' }}>
                        Subtotal (1 item): <span style={{ fontWeight: 'bold' }}>{formatCurrency(subtotal)}</span>
                    </div>
                </div>

                {/* Saved for Later section */}
                <div style={{ background: 'var(--surface)', padding: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '500', marginBottom: '1rem' }}>Saved for later (1 item)</h2>
                    <div style={{ display: 'flex', gap: '1rem', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                        <div style={{ fontSize: '4rem' }}>{savedForLater[0].image}</div>
                        <div>
                            <h3 style={{ fontSize: '1rem', color: 'var(--link)', fontWeight: '400' }}>{savedForLater[0].name}</h3>
                            <p style={{ fontWeight: 'bold', color: '#b12704', marginTop: '0.25rem' }}>{formatCurrency(savedForLater[0].price)}</p>
                            <button className="btn" style={{ background: 'white', marginTop: '0.5rem', width: 'auto', padding: '0.4rem 1rem' }}>Move to cart</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Checkout Sidebar */}
            <div style={{ background: 'var(--surface)', padding: '1.5rem' }}>
                <p style={{ color: '#007600', fontSize: '0.875rem', marginBottom: '1rem', display: 'flex', gap: '0.5rem' }}>
                    <span style={{ background: '#007600', color: 'white', padding: '0 4px', borderRadius: '50%' }}>✓</span> Your order qualifies for FREE Shipping.
                </p>
                <div style={{ fontSize: '1.125rem', marginBottom: '1.5rem' }}>
                    Subtotal (1 item): <span style={{ fontWeight: 'bold' }}>{formatCurrency(subtotal)}</span>
                </div>
                <button className="btn" style={{ padding: '0.75rem', fontSize: '1rem' }}>Proceed to checkout</button>
            </div>
        </div>
    );
}