const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const getProducts = async () => {
    try {
        const response = await fetch(`${API_URL}/api/products`, { cache: 'no-store' });
        if (!response.ok) throw new Error('Failed to fetch products');
        return await response.json();
    } catch (error) {
        console.error('Error fetching products:', error);
        return []; // Return empty array to prevent frontend crash if backend is down
    }
};

export const getProductById = async (id) => {
    try {
        const products = await getProducts();
        return products.find(p => p.id === id);
    } catch (error) {
        console.error(`Error fetching product ${id}:`, error);
        return null;
    }
};

export const runPricingInference = async (payload) => {
    try {
        const response = await fetch(`${API_URL}/api/predict`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (!response.ok) throw new Error('Prediction API failed');
        return await response.json();
    } catch (error) {
        console.error('Error running inference:', error);
        return null;
    }
};