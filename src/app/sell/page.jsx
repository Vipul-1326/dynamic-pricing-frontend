"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const INITIAL_PRODUCT = {
    name: '',
    category: 'Audio',
    image: '📱',
    description: ''
};

const INITIAL_ML_PARAMS = {
    baseCost: '',
    competitorPrice: '',
    supply: '',
    event: 'None',
    discountActive: false,
    demandTrend: 'Stable'
};

export default function SellerDashboard() {
    const router = useRouter();
    const [user, setUser] = useState(null);

    // UI State
    const [step, setStep] = useState(1);
    const [isCalculating, setIsCalculating] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // Product & ML State
    const [product, setProduct] = useState(INITIAL_PRODUCT);
    const [mlParams, setMlParams] = useState(INITIAL_ML_PARAMS);
    const [prediction, setPrediction] = useState(null);

    const resetForm = () => {
        setStep(1);
        setProduct(INITIAL_PRODUCT);
        setMlParams(INITIAL_ML_PARAMS);
        setPrediction(null);
        setErrorMessage('');
        setIsCalculating(false);
        setIsPublishing(false);
    };

    useEffect(() => {
        const storedUser = sessionStorage.getItem('authUser');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
            resetForm();
        } else {
            router.push('/login');
        }
    }, [router]);

    const handleProductChange = (e) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
    };

    const handleMlChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setMlParams({ ...mlParams, [e.target.name]: value });
    };

    const handleNextStep = () => {
        if (!product.name.trim()) {
            setErrorMessage('Please enter a product title before proceeding.');
            return;
        }
        setErrorMessage('');
        setStep(2);
    };

    const generateOptimalPrice = async (e) => {
        e.preventDefault();
        setIsCalculating(true);
        setErrorMessage('');

        const payload = {
            product_title: product.name.trim(),
            category: product.category,
            description: product.description.trim(),
            base_cost: parseFloat(mlParams.baseCost),
            competitor_price: parseFloat(mlParams.competitorPrice),
            available_supply: parseInt(mlParams.supply, 10),
            demand_trend: mlParams.demandTrend,
            event_seasonality: mlParams.event,
            apply_discount: mlParams.discountActive
        };

        try {
            const response = await fetch('http://localhost:5000/api/predict-price', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to generate optimal price');
            }

            setPrediction({
                optimal_selling_price: Number(data.optimal_selling_price),
                suggested_discount_percentage: Number(data.suggested_discount_percentage),
                estimated_profit_margin_percent: Number(data.estimated_profit_margin_percent)
            });

            setStep(3);
        } catch (error) {
            setErrorMessage(error.message);
        } finally {
            setIsCalculating(false);
        }
    };

    const publishProduct = async () => {
        if (!prediction) return;
        setIsPublishing(true);
        setErrorMessage('');

        const discountPct = prediction.suggested_discount_percentage;
        const sellingPrice = prediction.optimal_selling_price;
        const originalPrice =
            discountPct > 0 && discountPct < 100
                ? (sellingPrice / (1 - discountPct / 100)).toFixed(2)
                : parseFloat(mlParams.competitorPrice).toFixed(2);

        try {
            const response = await fetch('http://localhost:5000/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    seller_id: user.id,
                    ...product,
                    base_cost: parseFloat(mlParams.baseCost),
                    original_price: parseFloat(originalPrice),
                    current_price: parseFloat(sellingPrice.toFixed(2)),
                    stock: parseInt(mlParams.supply, 10)
                })
            });

            if (!response.ok) throw new Error('Failed to publish product');

            alert('Product successfully published with AI-optimized pricing!');
            resetForm();
            router.push('/');
        } catch (error) {
            setErrorMessage(error.message);
            setIsPublishing(false);
        }
    };

    if (!user) return null;

    return (
        <div style={{ maxWidth: '1000px', margin: '2rem auto', background: 'white', borderRadius: '8px', border: '1px solid var(--border)', overflow: 'hidden' }}>

            {/* Dashboard Header */}
            <div style={{ background: '#232f3e', color: 'white', padding: '2rem' }}>
                <h1 style={{ fontSize: '1.75rem', margin: 0 }}>Seller Central: Smart Pricing Engine</h1>
                <p style={{ marginTop: '0.5rem', color: '#ccc' }}>List your electronics and let our ML model optimize your margins.</p>
            </div>

            <div style={{ display: 'flex' }}>
                {/* Sidebar Navigation */}
                <div style={{ width: '250px', background: '#f8fafc', padding: '2rem 1rem', borderRight: '1px solid var(--border)' }}>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        <li
                            style={{ padding: '0.75rem', fontWeight: step === 1 ? 'bold' : 'normal', background: step === 1 ? '#e2e8f0' : 'transparent', borderRadius: '4px', cursor: 'pointer' }}
                            onClick={() => setStep(1)}
                        >
                            1. Product Details
                        </li>
                        <li
                            style={{ padding: '0.75rem', fontWeight: step === 2 ? 'bold' : 'normal', background: step === 2 ? '#e2e8f0' : 'transparent', borderRadius: '4px', cursor: 'pointer' }}
                            onClick={() => step > 1 && setStep(2)}
                        >
                            2. Market Parameters
                        </li>
                        <li
                            style={{ padding: '0.75rem', fontWeight: step === 3 ? 'bold' : 'normal', background: step === 3 ? '#e2e8f0' : 'transparent', borderRadius: '4px', cursor: 'pointer' }}
                            onClick={() => prediction && setStep(3)}
                        >
                            3. Review & Publish
                        </li>
                    </ul>
                </div>

                {/* Main Content Area */}
                <div style={{ flex: 1, padding: '2rem' }}>

                    {/* Error Banner */}
                    {errorMessage && (
                        <div style={{ background: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca', padding: '0.85rem 1rem', borderRadius: '6px', marginBottom: '1.5rem' }}>
                            {errorMessage}
                        </div>
                    )}

                    {/* STEP 1: Product Information */}
                    {step === 1 && (
                        <div>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Core Product Information</h2>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                <div style={{ gridColumn: '1 / span 2' }}>
                                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Product Title</label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        value={product.name}
                                        onChange={handleProductChange}
                                        style={{ width: '100%', padding: '0.75rem', border: '1px solid #ccc', borderRadius: '4px' }}
                                        placeholder="e.g. Sony WH-1000XM5 Headphones"
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Category</label>
                                    <select
                                        name="category"
                                        value={product.category}
                                        onChange={handleProductChange}
                                        style={{ width: '100%', padding: '0.75rem', border: '1px solid #ccc', borderRadius: '4px' }}
                                    >
                                        <option>Audio</option>
                                        <option>Computers</option>
                                        <option>Accessories</option>
                                        <option>Smart Home</option>
                                        <option>Video Games</option>
                                        <option>Storage</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Display Emoji</label>
                                    <input
                                        type="text"
                                        name="image"
                                        value={product.image}
                                        onChange={handleProductChange}
                                        style={{ width: '100%', padding: '0.75rem', border: '1px solid #ccc', borderRadius: '4px' }}
                                    />
                                </div>
                                <div style={{ gridColumn: '1 / span 2' }}>
                                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Description</label>
                                    <textarea
                                        name="description"
                                        value={product.description}
                                        onChange={handleProductChange}
                                        style={{ width: '100%', padding: '0.75rem', border: '1px solid #ccc', borderRadius: '4px', height: '100px' }}
                                        placeholder="Highlight key product specs and features..."
                                    />
                                </div>
                            </div>
                            <button className="btn" style={{ marginTop: '2rem', width: 'auto', padding: '0.75rem 2rem' }} onClick={handleNextStep}>
                                Next: Pricing Parameters →
                            </button>
                        </div>
                    )}

                    {/* STEP 2: ML Parameters */}
                    {step === 2 && (
                        <form onSubmit={generateOptimalPrice}>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Machine Learning Pricing Parameters</h2>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Feed accurate environmental data to the ML model to generate the most competitive and profitable price.</p>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Your Base Cost ($)</label>
                                    <input type="number" step="0.01" min="0" required name="baseCost" value={mlParams.baseCost} onChange={handleMlChange} style={{ width: '100%', padding: '0.75rem', border: '1px solid #ccc', borderRadius: '4px' }} placeholder="Cost to manufacture/acquire" />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Avg. Competitor Price ($)</label>
                                    <input type="number" step="0.01" min="0" required name="competitorPrice" value={mlParams.competitorPrice} onChange={handleMlChange} style={{ width: '100%', padding: '0.75rem', border: '1px solid #ccc', borderRadius: '4px' }} placeholder="Current market average" />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Available Supply</label>
                                    <input type="number" min="1" required name="supply" value={mlParams.supply} onChange={handleMlChange} style={{ width: '100%', padding: '0.75rem', border: '1px solid #ccc', borderRadius: '4px' }} placeholder="Units in stock" />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Demand Trend</label>
                                    <select name="demandTrend" value={mlParams.demandTrend} onChange={handleMlChange} style={{ width: '100%', padding: '0.75rem', border: '1px solid #ccc', borderRadius: '4px' }}>
                                        <option>High</option>
                                        <option>Stable</option>
                                        <option>Low</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Event / Seasonality</label>
                                    <select name="event" value={mlParams.event} onChange={handleMlChange} style={{ width: '100%', padding: '0.75rem', border: '1px solid #ccc', borderRadius: '4px' }}>
                                        <option>None</option>
                                        <option>Festival</option>
                                        <option>Holiday</option>
                                        <option>Weekend Sale</option>
                                    </select>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', marginTop: '1.5rem' }}>
                                    <input type="checkbox" id="discount" name="discountActive" checked={mlParams.discountActive} onChange={handleMlChange} style={{ width: '20px', height: '20px', marginRight: '0.75rem' }} />
                                    <label htmlFor="discount" style={{ fontWeight: 'bold' }}>Apply Platform-Wide Discount?</label>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                                <button type="button" className="btn" style={{ background: 'white', width: 'auto', padding: '0.75rem 2rem' }} onClick={() => setStep(1)}>Back</button>
                                <button type="submit" className="btn" disabled={isCalculating} style={{ width: 'auto', padding: '0.75rem 2rem', background: '#ffa41c', borderColor: '#ff8f00' }}>
                                    {isCalculating ? 'AI is Processing...' : 'Generate Optimal Price'}
                                </button>
                            </div>
                        </form>
                    )}

                    {/* STEP 3: Review & Publish */}
                    {step === 3 && prediction && (
                        <div>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Review & Publish</h2>

                            <div style={{ background: '#f0f2f2', padding: '2rem', borderRadius: '8px', textAlign: 'center', marginBottom: '2rem', border: '1px solid #ccc' }}>
                                <p style={{ fontSize: '1.125rem', color: 'var(--text-muted)', margin: 0 }}>Machine Learning Optimal Selling Price</p>
                                <div style={{ fontSize: '4rem', fontWeight: 'bold', color: '#b12704', margin: '0.75rem 0' }}>
                                    ${prediction.optimal_selling_price.toFixed(2)}
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'center', gap: '2.5rem', marginTop: '1.25rem', flexWrap: 'wrap' }}>
                                    <div style={{ background: 'white', padding: '0.75rem 1.5rem', borderRadius: '6px', border: '1px solid #ddd' }}>
                                        <span style={{ display: 'block', fontSize: '0.85rem', color: '#555' }}>Suggested Discount</span>
                                        <strong style={{ fontSize: '1.25rem', color: '#c45500' }}>
                                            {prediction.suggested_discount_percentage.toFixed(1)}%
                                        </strong>
                                    </div>
                                    <div style={{ background: 'white', padding: '0.75rem 1.5rem', borderRadius: '6px', border: '1px solid #ddd' }}>
                                        <span style={{ display: 'block', fontSize: '0.85rem', color: '#555' }}>Estimated Profit Margin</span>
                                        <strong style={{ fontSize: '1.25rem', color: '#007600' }}>
                                            {prediction.estimated_profit_margin_percent.toFixed(1)}%
                                        </strong>
                                    </div>
                                </div>
                            </div>

                            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                                <button className="btn" style={{ background: 'white', width: 'auto', padding: '0.75rem 2rem' }} onClick={() => setStep(2)}>Adjust Parameters</button>
                                <button className="btn" style={{ background: '#ffd814', width: 'auto', padding: '0.75rem 2rem' }} onClick={publishProduct} disabled={isPublishing}>
                                    {isPublishing ? 'Publishing...' : 'Confirm & Publish Listing'}
                                </button>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}