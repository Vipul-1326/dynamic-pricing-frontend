"use client";
import Link from 'next/link';
import { formatCurrency } from '../../../lib/utils'; //

export default function ProductCard({ product }) {
    return (
        <Link href={`/product/${product.id}`} className="product-card">
            <div className="product-image">{product.image}</div>
            <div className="product-info">
                <h3 className="product-title">{product.name}</h3>
                <div className="product-rating">
                    {'★'.repeat(Math.floor(product.rating))}
                    <span style={{ color: 'var(--link)', marginLeft: '0.25rem' }}>{product.reviews}</span>
                </div>
                <div className="price-container">
                    <span className="current-price">{formatCurrency(product.currentPrice)}</span>
                    {product.originalPrice > product.currentPrice && (
                        <span className="original-price">{formatCurrency(product.originalPrice)}</span>
                    )}
                </div>
                <button className="btn" onClick={(e) => { e.preventDefault(); alert('Added to cart!'); }}>
                    Add to Cart
                </button>
            </div>
        </Link>
    );
}