"use client";
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getProducts } from '@/app/services/productService';
import ProductCard from './components/productCard';

function StorefrontContent() {
    const [products, setProducts] = useState([]);
    const searchParams = useSearchParams();
    const router = useRouter();

    const categoryQuery = searchParams.get('category');
    const searchQuery = searchParams.get('search');

    useEffect(() => {
        getProducts().then(setProducts);
    }, []);

    const filteredProducts = products.filter(product => {
        let matchesCategory = categoryQuery ? product.category === categoryQuery : true;
        let matchesSearch = searchQuery
            ? product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.category.toLowerCase().includes(searchQuery.toLowerCase())
            : true;
        return matchesCategory && matchesSearch;
    });

    const categories = ['Audio', 'Computers', 'Accessories', 'Smart Home', 'Video Games', 'Storage'];

    return (
        <div className="store-layout">
            <aside>
                <h3 className="sidebar-title">Departments</h3>
                <ul className="sidebar-list">
                    <li onClick={() => router.push('/')} style={{ fontWeight: !categoryQuery ? 'bold' : 'normal', cursor: 'pointer', marginBottom: '0.5rem' }}>
                        Any Department
                    </li>
                    {categories.map(cat => (
                        <li
                            key={cat}
                            onClick={() => router.push(`/?category=${encodeURIComponent(cat)}`)}
                            style={{ fontWeight: categoryQuery === cat ? 'bold' : 'normal', cursor: 'pointer', marginBottom: '0.5rem', color: categoryQuery === cat ? 'var(--discount)' : 'inherit' }}
                        >
                            {cat}
                        </li>
                    ))}
                </ul>
            </aside>

            <div>
                {!searchQuery && !categoryQuery && (
                    <div className="hero-banner">
                        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Tech Week is Here.</h1>
                        <p style={{ fontSize: '1.25rem', opacity: 0.9 }}>AI-optimized prices guarantee you the best electronics deals.</p>
                    </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
          <span style={{ fontWeight: 'bold', fontSize: '1.125rem' }}>
            {searchQuery && `Search results for "${searchQuery}"`}
              {categoryQuery && `${categoryQuery} Products`}
              {!searchQuery && !categoryQuery && `All Electronics (${filteredProducts.length} results)`}
          </span>
                </div>

                {filteredProducts.length === 0 ? (
                    <div style={{ padding: '4rem 2rem', textAlign: 'center', background: 'white' }}>
                        <h2 style={{ fontSize: '1.5rem', color: 'var(--text-muted)' }}>No products found.</h2>
                        <button className="btn" style={{ width: 'auto', marginTop: '1rem', padding: '0.5rem 2rem' }} onClick={() => router.push('/')}>Clear Filters</button>
                    </div>
                ) : (
                    <div className="grid">
                        {filteredProducts.map(product => <ProductCard key={product.id} product={product} />)}
                    </div>
                )}
            </div>
        </div>
    );
}

export default function Storefront() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <StorefrontContent />
        </Suspense>
    );
}