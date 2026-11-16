"use client";
import { useState, useEffect } from 'react';
import { getProducts, runPricingInference } from '../../services/pricingService';
import PriceChart from '../../components/PriceChart';
import { formatCurrency } from '../../lib/utils';

export default function SimulatorPage() {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [form, setForm] = useState({ competitorPrice: '', isHoliday: false });
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    useEffect(() => {
        getProducts().then(setProducts);
    }, []);

    const handleProductChange = (e) => {
        const prod = products.find(p => p.id === e.target.value);
        setSelectedProduct(prod);
        setForm({ ...form, competitorPrice: prod ? prod.competitorPrice : '' });
    };

    const handleRunInference = async (e) => {
        e.preventDefault();
        setLoading(true);

        const payload = {
            productId: selectedProduct.id,
            baseCost: selectedProduct.baseCost,
            competitorPrice: parseFloat(form.competitorPrice),
            isHoliday: form.isHoliday
        };

        const data = await runPricingInference(payload);
        setResult(data);
        setLoading(false);
    };

    return (
        <div style={{ maxWidth: '1100px' }}>
            <h1 className="page-title">XGBoost Pricing Simulator</h1>

            <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '2rem' }}>
                {/* Left Column: Inference Parameters */}
                <div className="card" style={{ alignSelf: 'start' }}>
                    <h2 className="section-title">Inference Parameters</h2>
                    <form onSubmit={handleRunInference}>
                        <div className="form-group">
                            <label className="form-label">Select SKU</label>
                            <select className="form-input" required onChange={handleProductChange}>
                                <option value="">-- Select Product --</option>
                                {products.map(p => (
                                    <option key={p.id} value={p.id}>{p.id} - {p.name}</option>
                                ))}
                            </select>
                        </div>

                        {selectedProduct && (
                            <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '6px', marginBottom: '1.25rem', fontSize: '0.875rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>Base Cost:</span>
                                    <span style={{ fontWeight: '600' }}>{formatCurrency(selectedProduct.baseCost)}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>Inventory Status:</span>
                                    <span style={{ fontWeight: '600' }}>{selectedProduct.currentStock} units</span>
                                </div>
                            </div>
                        )}

                        <div className="form-group">
                            <label className="form-label">Simulated Competitor Price ($)</label>
                            <input type="number" step="0.01" className="form-input" required value={form.competitorPrice} onChange={(e) => setForm({...form, competitorPrice: e.target.value})} />
                        </div>

                        <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <input type="checkbox" id="holiday" checked={form.isHoliday} onChange={(e) => setForm({...form, isHoliday: e.target.checked})} />
                            <label htmlFor="holiday" style={{ fontSize: '0.875rem', cursor: 'pointer' }}>Apply Weekend/Holiday Demand Surge</label>
                        </div>

                        <button type="submit" className="btn" style={{ width: '100%' }} disabled={loading || !selectedProduct}>
                            {loading ? 'Executing Pipeline...' : 'Run Prediction'}
                        </button>
                    </form>
                </div>

                {/* Right Column: Model Output */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {result ? (
                        <>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                                <div className="card" style={{ borderLeft: '4px solid var(--primary)', padding: '1rem' }}>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Recommended Price</p>
                                    <p style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--primary)' }}>{formatCurrency(result.recommended_price)}</p>
                                </div>
                                <div className="card" style={{ padding: '1rem' }}>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Predicted Demand</p>
                                    <p style={{ fontSize: '1.75rem', fontWeight: '700' }}>{result.predicted_demand}</p>
                                </div>
                                <div className="card" style={{ borderLeft: '4px solid var(--success)', padding: '1rem' }}>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Expected Profit</p>
                                    <p style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--success)' }}>{formatCurrency(result.expected_profit)}</p>
                                </div>
                            </div>
                            <div className="card">
                                <h2 className="section-title">Demand Elasticity Curve</h2>
                                <PriceChart data={result.curve_data} />
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