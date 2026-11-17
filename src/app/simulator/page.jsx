"use client";

import { useEffect, useState } from 'react';
import { getProducts, runPricingInference } from '../services/productService';
import { formatCurrency } from '../../../lib/utils';

function DemandElasticityChart({ data }) {
    const points = Array.isArray(data)
        ? data.filter((point) => Number.isFinite(Number(point.price)))
        : [];

    if (points.length === 0) {
        return <p style={{ color: 'var(--text-muted)' }}>No demand curve data is available.</p>;
    }

    const chartWidth = 640;
    const chartHeight = 220;
    const padding = 24;
    const prices = points.map((point) => Number(point.price));
    const demands = points.map((point) => Number(point.demand) || 0);
    const profits = points.map((point) => Number(point.profit) || 0);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const maxDemand = Math.max(...demands, 1);
    const minProfit = Math.min(...profits, 0);
    const maxProfit = Math.max(...profits, 1);

    const toPath = (values, minValue, maxValue) => values.map((value, index) => {
        const x = padding + (prices.length === 1 ? 0 : (index / (prices.length - 1)) * (chartWidth - padding * 2));
        const y = chartHeight - padding - ((value - minValue) / (maxValue - minValue || 1)) * (chartHeight - padding * 2);
        return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');

    return (
        <div>
            <svg role="img" aria-label="Demand and projected profit by price" viewBox={`0 0 ${chartWidth} ${chartHeight}`} style={{ width: '100%', height: 'auto', minHeight: '220px' }}>
                <line x1={padding} y1={chartHeight - padding} x2={chartWidth - padding} y2={chartHeight - padding} stroke="#cbd5e1" />
                <line x1={padding} y1={padding} x2={padding} y2={chartHeight - padding} stroke="#cbd5e1" />
                <path d={toPath(demands, 0, maxDemand)} fill="none" stroke="#64748b" strokeWidth="3" />
                <path d={toPath(profits, minProfit, maxProfit)} fill="none" stroke="#3b82f6" strokeWidth="3" />
            </svg>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                <span>{formatCurrency(minPrice)}</span>
                <span>{formatCurrency(maxPrice)}</span>
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.75rem', fontSize: '0.875rem' }}>
                <span><span style={{ color: '#64748b' }}>━</span> Predicted demand</span>
                <span><span style={{ color: '#3b82f6' }}>━</span> Projected profit</span>
            </div>
        </div>
    );
}

export default function SimulatorPage() {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [form, setForm] = useState({ competitorPrice: '', isHoliday: false });
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        let cancelled = false;

        getProducts()
            .then((items) => {
                if (!cancelled) {
                    setProducts(Array.isArray(items) ? items : []);
                }
            })
            .catch(() => {
                if (!cancelled) {
                    setProducts([]);
                    setError('Unable to load products. Please try again later.');
                }
            });

        return () => {
            cancelled = true;
        };
    }, []);

    const handleProductChange = (event) => {
        const product = products.find((item) => String(item.id) === event.target.value) || null;
        setSelectedProduct(product);
        setForm((currentForm) => ({
            ...currentForm,
            competitorPrice: product?.competitorPrice ?? '',
        }));
        setResult(null);
        setError('');
    };

    const handleRunInference = async (event) => {
        event.preventDefault();
        if (!selectedProduct) {
            setError('Please select a product before running a prediction.');
            return;
        }

        const competitorPrice = Number(form.competitorPrice);
        if (!Number.isFinite(competitorPrice) || competitorPrice <= 0) {
            setError('Enter a valid competitor price greater than zero.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const prediction = await runPricingInference({
                productId: selectedProduct.id,
                baseCost: Number(selectedProduct.baseCost) || 0,
                competitorPrice,
                isHoliday: form.isHoliday,
            });

            if (!prediction) {
                throw new Error('The pricing service did not return a prediction.');
            }
            setResult(prediction);
        } catch (requestError) {
            setResult(null);
            setError(requestError.message || 'Unable to run the pricing prediction. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '1100px' }}>
            <h1 className="page-title">XGBoost Pricing Simulator</h1>

            <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '2rem' }}>
                <div className="card" style={{ alignSelf: 'start' }}>
                    <h2 className="section-title">Inference Parameters</h2>
                    <form onSubmit={handleRunInference}>
                        <div className="form-group">
                            <label className="form-label" htmlFor="product">Select SKU</label>
                            <select id="product" className="form-input" required value={selectedProduct ? String(selectedProduct.id) : ''} onChange={handleProductChange}>
                                <option value="">-- Select Product --</option>
                                {products.map((product) => (
                                    <option key={product.id} value={String(product.id)}>{product.id} - {product.name}</option>
                                ))}
                            </select>
                        </div>

                        {selectedProduct && (
                            <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '6px', marginBottom: '1.25rem', fontSize: '0.875rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>Base Cost:</span>
                                    <span style={{ fontWeight: '600' }}>{formatCurrency(Number(selectedProduct.baseCost) || 0)}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>Inventory Status:</span>
                                    <span style={{ fontWeight: '600' }}>{selectedProduct.currentStock ?? '—'} units</span>
                                </div>
                            </div>
                        )}

                        <div className="form-group">
                            <label className="form-label" htmlFor="competitor-price">Simulated Competitor Price ($)</label>
                            <input id="competitor-price" type="number" min="0.01" step="0.01" className="form-input" required value={form.competitorPrice} onChange={(event) => setForm((currentForm) => ({ ...currentForm, competitorPrice: event.target.value }))} />
                        </div>

                        <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <input type="checkbox" id="holiday" checked={form.isHoliday} onChange={(event) => setForm((currentForm) => ({ ...currentForm, isHoliday: event.target.checked }))} />
                            <label htmlFor="holiday" style={{ fontSize: '0.875rem', cursor: 'pointer' }}>Apply Weekend/Holiday Demand Surge</label>
                        </div>

                        {error && <p role="alert" style={{ color: 'var(--danger, #b91c1c)', marginBottom: '1rem' }}>{error}</p>}
                        <button type="submit" className="btn" style={{ width: '100%' }} disabled={loading || !selectedProduct}>
                            {loading ? 'Executing Pipeline...' : 'Run Prediction'}
                        </button>
                    </form>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {result ? (
                        <>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                                <div className="card" style={{ borderLeft: '4px solid var(--primary)', padding: '1rem' }}>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Recommended Price</p>
                                    <p style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--primary)' }}>{formatCurrency(Number(result.recommended_price) || 0)}</p>
                                </div>
                                <div className="card" style={{ padding: '1rem' }}>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Predicted Demand</p>
                                    <p style={{ fontSize: '1.75rem', fontWeight: '700' }}>{result.predicted_demand ?? '—'}</p>
                                </div>
                                <div className="card" style={{ borderLeft: '4px solid var(--success)', padding: '1rem' }}>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Expected Profit</p>
                                    <p style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--success)' }}>{formatCurrency(Number(result.expected_profit) || 0)}</p>
                                </div>
                            </div>
                            <div className="card">
                                <h2 className="section-title">Demand Elasticity Curve</h2>
                                <DemandElasticityChart data={result.curve_data} />
                            </div>
                        </>
                    ) : (
                        <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)', background: '#f8fafc' }}>
                            Select a product and run inference to view model outputs.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
