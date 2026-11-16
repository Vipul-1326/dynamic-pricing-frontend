import { apiClient } from './api';

export const getProducts = async () => {
    // Mock data for realistic frontend rendering without the backend running
    return [
        { id: 'SKU-772', name: 'Logitech MX Master 3S', baseCost: 45.00, currentStock: 320, competitorPrice: 99.99 },
        { id: 'SKU-891', name: 'Sony WH-1000XM5', baseCost: 180.00, currentStock: 85, competitorPrice: 348.00 },
        { id: 'SKU-102', name: 'Anker USB-C Hub', baseCost: 12.50, currentStock: 640, competitorPrice: 34.99 },
    ];
};

export const runPricingInference = async (payload) => {
    try {
        // Attempt actual FastAPI connection
        return await apiClient('/predict', { method: 'POST', body: JSON.stringify(payload) });
    } catch (e) {
        // Fallback Mock ML Response simulating XGBoost Output
        await new Promise(r => setTimeout(r, 600)); // Simulate latency
        const recPrice = payload.competitorPrice * 0.96; // Undercut by 4%
        return {
            product_id: payload.productId,
            recommended_price: recPrice,
            predicted_demand: 142,
            expected_profit: (recPrice - payload.baseCost) * 142,
            confidence_score: 0.92,
            curve_data: [
                { price: recPrice * 0.8, demand: 210, profit: ((recPrice*0.8)-payload.baseCost)*210 },
                { price: recPrice * 0.9, demand: 180, profit: ((recPrice*0.9)-payload.baseCost)*180 },
                { price: recPrice, demand: 142, profit: (recPrice-payload.baseCost)*142 },
                { price: recPrice * 1.1, demand: 60, profit: ((recPrice*1.1)-payload.baseCost)*60 },
                { price: recPrice * 1.2, demand: 15, profit: ((recPrice*1.2)-payload.baseCost)*15 },
            ]
        };
    }
};