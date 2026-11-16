"use client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { formatCurrency } from '../lib/utils';

export default function PriceChart({ data }) {
    if (!data || data.length === 0) return null;

    return (
        <div style={{ height: '300px', width: '100%', marginTop: '1.5rem' }}>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis dataKey="price" tickFormatter={(val) => `$${val}`} style={{ fontSize: '12px' }} />
                    <YAxis yAxisId="left" style={{ fontSize: '12px' }} />
                    <YAxis yAxisId="right" orientation="right" style={{ fontSize: '12px' }} />
                    <Tooltip formatter={(value, name) => [name === 'profit' ? formatCurrency(value) : value, name === 'profit' ? 'Projected Profit' : 'Predicted Demand']} />
                    <Legend wrapperStyle={{ fontSize: '12px' }}/>
                    <Line yAxisId="left" type="monotone" dataKey="demand" stroke="#64748b" strokeWidth={2} dot={{ r: 4 }} name="demand" />
                    <Line yAxisId="right" type="monotone" dataKey="profit" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} name="profit" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}