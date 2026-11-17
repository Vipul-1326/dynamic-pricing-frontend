export const formatCurrency = (value) => {
    const numericValue = Number(value) || 0;
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(numericValue);
};

export const formatNumber = (value) => {
    const numericValue = Number(value) || 0;
    return new Intl.NumberFormat('en-US', {
        maximumFractionDigits: 0,
    }).format(numericValue);
};
