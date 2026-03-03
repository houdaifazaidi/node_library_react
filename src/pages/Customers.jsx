import { useState, useEffect } from 'react';

const API = '/api';

export default function Customers() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [form, setForm] = useState({ name: '', email: '' });
    const [submitting, setSubmitting] = useState(false);
    const [feedback, setFeedback] = useState(null);
    const [showForm, setShowForm] = useState(false);

    const fetchCustomers = () => {
        setLoading(true);
        fetch(`${API}/customers`)
            .then(r => r.json())
            .then(data => {
                setCustomers(data.customers || []);
                setLoading(false);
            })
            .catch(() => {
                setError('Failed to fetch customers.');
                setLoading(false);
            });
    };

    useEffect(() => { fetchCustomers(); }, []);

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleAdd = e => {
        e.preventDefault();
        if (!form.name || !form.email) return;
        setSubmitting(true);
        fetch(`${API}/customer`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form),
        })
            .then(r => r.json())
            .then(() => {
                setFeedback({ type: 'success', msg: 'Customer added successfully!' });
                setForm({ name: '', email: '' });
                setShowForm(false);
                fetchCustomers();
            })
            .catch(() => setFeedback({ type: 'danger', msg: 'Error adding customer.' }))
            .finally(() => setSubmitting(false));
    };

    const handleDelete = id => {
        if (!confirm('Delete this customer?')) return;
        fetch(`${API}/customers/${id}`, { method: 'DELETE' })
            .then(r => r.json())
            .then(() => {
                setFeedback({ type: 'success', msg: 'Customer deleted.' });
                fetchCustomers();
            })
            .catch(() => setFeedback({ type: 'danger', msg: 'Error deleting customer.' }));
    };

    return (
        <div className="page">
            <div className="page-header">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <h1 className="page-title">👥 Customers</h1>
                        <p className="page-subtitle">Manage your library members</p>
                    </div>
                    <button className="btn btn-primary" onClick={() => setShowForm(v => !v)}>
                        {showForm ? '✕ Cancel' : '＋ Add Customer'}
                    </button>
                </div>
            </div>

            {feedback && (
                <div className={`alert alert-${feedback.type}`} onClick={() => setFeedback(null)}>
                    {feedback.type === 'success' ? '✅' : '❌'} {feedback.msg}
                </div>
            )}

            {showForm && (
                <div className="panel">
                    <div className="panel-title">✏️ New Customer</div>
                    <form onSubmit={handleAdd}>
                        <div className="grid-2">
                            <div className="form-group">
                                <label className="form-label">Name</label>
                                <input className="form-input" name="name" value={form.name} onChange={handleChange} placeholder="e.g. John Doe" required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Email</label>
                                <input className="form-input" name="email" type="email" value={form.email} onChange={handleChange} placeholder="e.g. john@email.com" required />
                            </div>
                        </div>
                        <button className="btn btn-primary" type="submit" disabled={submitting}>
                            {submitting ? 'Saving…' : '💾 Save Customer'}
                        </button>
                    </form>
                </div>
            )}

            <div className="card">
                <div className="card-header">
                    <span className="card-title">All Customers</span>
                    <span className="badge badge-green">{customers.length} total</span>
                </div>

                {loading ? (
                    <div className="loading-spinner"><div className="spinner"></div></div>
                ) : error ? (
                    <div className="alert alert-danger">❌ {error}</div>
                ) : customers.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">👤</div>
                        <p>No customers yet. Add your first one!</p>
                    </div>
                ) : (
                    <div className="table-wrapper">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {customers.map(c => (
                                    <tr key={c._id}>
                                        <td><span className="id-badge" title={c._id}>{c._id}</span></td>
                                        <td style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{c.name}</td>
                                        <td>{c.email}</td>
                                        <td>
                                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(c._id)}>
                                                🗑 Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
