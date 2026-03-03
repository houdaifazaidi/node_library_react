import { useState, useEffect } from 'react';

const ORDERS_API = '';
const BOOKS_API = '';
const CUSTOMERS_API = '';

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [books, setBooks] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [form, setForm] = useState({ CustomerID: '', BookID: '', initialDate: '', deliveryDate: '' });
    const [submitting, setSubmitting] = useState(false);
    const [feedback, setFeedback] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [detailModal, setDetailModal] = useState(null);
    const [detailLoading, setDetailLoading] = useState(false);

    const fetchOrders = () => {
        setLoading(true);
        fetch(`${ORDERS_API}/orders`)
            .then(r => r.json())
            .then(data => {
                setOrders(data.orders || []);
                setLoading(false);
            })
            .catch(() => {
                setError('Failed to fetch orders.');
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchOrders();
        // Fetch books and customers for the dropdown selectors
        fetch(`${BOOKS_API}/books`).then(r => r.json()).then(d => setBooks(d.books || []));
        fetch(`${CUSTOMERS_API}/customers`).then(r => r.json()).then(d => setCustomers(d.customers || []));
    }, []);

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleAdd = e => {
        e.preventDefault();
        if (!form.CustomerID || !form.BookID || !form.initialDate || !form.deliveryDate) return;
        setSubmitting(true);
        fetch(`${ORDERS_API}/order`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form),
        })
            .then(r => r.json())
            .then(() => {
                setFeedback({ type: 'success', msg: 'Order placed successfully!' });
                setForm({ CustomerID: '', BookID: '', initialDate: '', deliveryDate: '' });
                setShowForm(false);
                fetchOrders();
            })
            .catch(() => setFeedback({ type: 'danger', msg: 'Error creating order.' }))
            .finally(() => setSubmitting(false));
    };

    const handleViewDetail = id => {
        setDetailLoading(true);
        setDetailModal({ loading: true });
        fetch(`${ORDERS_API}/order/${id}`)
            .then(r => r.json())
            .then(data => {
                setDetailModal({ ...data.order, id });
                setDetailLoading(false);
            })
            .catch(() => {
                setDetailModal({ error: 'Failed to load order details.' });
                setDetailLoading(false);
            });
    };

    const formatDate = dateStr => {
        if (!dateStr) return '—';
        return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    return (
        <div className="page">
            <div className="page-header">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <h1 className="page-title">📦 Orders</h1>
                        <p className="page-subtitle">Track all library orders</p>
                    </div>
                    <button className="btn btn-primary" onClick={() => setShowForm(v => !v)}>
                        {showForm ? '✕ Cancel' : '＋ New Order'}
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
                    <div className="panel-title">✏️ New Order</div>
                    <form onSubmit={handleAdd}>
                        <div className="grid-2">
                            <div className="form-group">
                                <label className="form-label">Customer</label>
                                <select className="form-input" name="CustomerID" value={form.CustomerID} onChange={handleChange} required>
                                    <option value="">Select a customer…</option>
                                    {customers.map(c => (
                                        <option key={c._id} value={c._id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Book</label>
                                <select className="form-input" name="BookID" value={form.BookID} onChange={handleChange} required>
                                    <option value="">Select a book…</option>
                                    {books.map(b => (
                                        <option key={b._id} value={b._id}>{b.title}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Order Date</label>
                                <input className="form-input" type="date" name="initialDate" value={form.initialDate} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Delivery Date</label>
                                <input className="form-input" type="date" name="deliveryDate" value={form.deliveryDate} onChange={handleChange} required />
                            </div>
                        </div>
                        <button className="btn btn-primary" type="submit" disabled={submitting}>
                            {submitting ? 'Placing…' : '💾 Place Order'}
                        </button>
                    </form>
                </div>
            )}

            <div className="card">
                <div className="card-header">
                    <span className="card-title">All Orders</span>
                    <span className="badge badge-blue">{orders.length} total</span>
                </div>

                {loading ? (
                    <div className="loading-spinner"><div className="spinner"></div></div>
                ) : error ? (
                    <div className="alert alert-danger">❌ {error}</div>
                ) : orders.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">📭</div>
                        <p>No orders yet.</p>
                    </div>
                ) : (
                    <div className="table-wrapper">
                        <table>
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Customer ID</th>
                                    <th>Book ID</th>
                                    <th>Order Date</th>
                                    <th>Delivery Date</th>
                                    <th>Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map(o => (
                                    <tr key={o._id}>
                                        <td><span className="id-badge" title={o._id}>{o._id}</span></td>
                                        <td><span className="id-badge" title={o.CustomerID}>{o.CustomerID}</span></td>
                                        <td><span className="id-badge" title={o.BookID}>{o.BookID}</span></td>
                                        <td>{formatDate(o.initialDate)}</td>
                                        <td>{formatDate(o.deliveryDate)}</td>
                                        <td>
                                            <button className="btn btn-ghost btn-sm" onClick={() => handleViewDetail(o._id)}>
                                                🔍 View
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Order Detail Modal */}
            {detailModal && (
                <div className="modal-overlay" onClick={() => setDetailModal(null)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <span className="modal-title">📦 Order Details</span>
                            <button className="btn btn-ghost btn-sm" onClick={() => setDetailModal(null)}>✕</button>
                        </div>
                        {detailModal.loading ? (
                            <div className="loading-spinner"><div className="spinner"></div></div>
                        ) : detailModal.error ? (
                            <div className="alert alert-danger">❌ {detailModal.error}</div>
                        ) : (
                            <div className="modal-detail">
                                <div className="detail-row">
                                    <span className="detail-label">👤 Customer</span>
                                    <span className="detail-value">{detailModal.customerName || '—'}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">📖 Book</span>
                                    <span className="detail-value">{detailModal.bookTitle || '—'}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
