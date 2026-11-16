"use client";
import { useEffect, useState } from 'react';
import { getProducts } from '@/app/services/productService';
import ProductCard from '../components/productCard';

export default function DealsPage() {
    const [deals, setDeals] = useState([]);

    useEffect(() => {
        // A deal is defined as a product where the original price is greater than the current ML price
        getProducts().then(allProducts => {
            setDeals(allProducts.filter(p => p.originalPrice > p.currentPrice));
        });
    }, []);

    return (
        <div>
            <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Today's Deals</h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Exclusive discounts driven by dynamic pricing. Limited time only.</p>

            <div className="grid">
                {deals.map(product => (
                    <div key={product.id} style={{ position: 'relative' }}>
                        <div style={{ position: 'absolute', top: 10, left: 10, background: '#cc0c39', color: 'white', padding: '4px 8px', borderRadius: '4px', zIndex: 10, fontWeight: 'bold', fontSize: '0.875rem' }}>
                            Save {(100 - (product.currentPrice / product.originalPrice) * 100).toFixed(0)}%
                        </div>
                        <ProductCard product={product} />
                    </div>
                ))}
            </div>
        </div>
    );
}