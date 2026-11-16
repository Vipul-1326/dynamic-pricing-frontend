"use client";
import { useEffect, useState, use } from 'react';
import { getProductById } from '../../services/productService';
import { formatCurrency } from '../../../../lib/utils';
import Link from 'next/link';

export default function ProductDetail({ params }) {
    // Unwrap the params Promise using React.use()
    const { id } = use(params);
    const [product, setProduct] = useState(null);

    useEffect(() => {
        getProductById(id).then(setProduct);
    }, [id]);

    if (!product) return <div style={{ padding: '2rem' }}>Loading product details...</div>;

    return (
        <div>
            <Link href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.875rem' }}>‹ Back to results</Link>

            <div className="detail-container" style={{ marginTop: '1rem' }}>
                <div className="detail-image">{product.image}</div>

                <div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: '500', lineHeight: '1.3' }}>{product.name}</h1>
                    <p style={{ color: 'var(--link)', fontSize: '0.875rem' }}>Visit the {product.category} Store</p>

                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '1rem' }}>
                        {product.originalPrice > product.currentPrice && (
                            <span style={{ fontSize: '1.75rem', color: 'var(--discount)' }}>-{(100 - (product.currentPrice / product.originalPrice) * 100).toFixed(0)}%</span>
                        )}
                        <span style={{ fontSize: '2rem', fontWeight: '500' }}>{formatCurrency(product.currentPrice)}</span>
                    </div>

                    <h3 style={{ marginTop: '1.5rem', fontSize: '1rem' }}>About this item</h3>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-main)', marginTop: '0.5rem' }}>{product.description}</p>
                </div>

                <div style={{ border: '1px solid var(--border)', borderRadius: '8px', padding: '1.5rem', alignSelf: 'start' }}>
                    <span style={{ fontSize: '1.5rem', fontWeight: '500' }}>{formatCurrency(product.currentPrice)}</span>
                    <h2 style={{ color: '#007600', fontSize: '1.125rem', margin: '1rem 0' }}>In Stock</h2>
                    <button className="btn" style={{ marginBottom: '0.5rem' }} onClick={() => alert('Added to cart!')}>Add to Cart</button>
                    <button className="btn" style={{ background: '#ffa41c', borderColor: '#ff8f00' }}>Buy Now</button>
                </div>
            </div>
        </div>
    );
}