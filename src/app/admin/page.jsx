"use client";
export default function AdminPage() {
    return (
        <div style={{ maxWidth: '800px' }}>
            <h1 className="page-title">Model Administration (MLOps)</h1>
            <div className="card">
                <h2 className="section-title">Model Health & Drift Detection</h2>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
                    <div>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Current Model Version</p>
                        <p style={{ fontWeight: '600' }}>XGBoost-v2.4.1 (Deployed 12 days ago)</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Data Drift Status</p>
                        <p style={{ fontWeight: '600', color: 'var(--success)' }}>Nominal (KL Divergence: 0.04)</p>
                    </div>
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                    Automated CI/CD pipelines will handle retraining if KL Divergence exceeds threshold.
                </p>
                <button className="btn" style={{ background: 'var(--sidebar-hover)' }}>Force Manual Retrain</button>
            </div>
        </div>
    );
}