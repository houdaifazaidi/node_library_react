import { useState, useEffect } from 'react';

const API = '/api/books';

export default function Books() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [form, setForm] = useState({ title: '', author: '', publisher: '' });
    const [submitting, setSubmitting] = useState(false);
    const [feedback, setFeedback] = useState(null);
    const [showForm, setShowForm] = useState(false);

    const fetchBooks = () => {
        setLoading(true);
        fetch(`${API}/books`)
            .then(r => r.json())
            .then(data => {
                setBooks(data.books || []);
                setLoading(false);
            })
            .catch(() => {
                setError('Failed to fetch books.');
                setLoading(false);
            });
    };

    useEffect(() => { fetchBooks(); }, []);

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleAdd = e => {
        e.preventDefault();
        if (!form.title || !form.author || !form.publisher) return;
        setSubmitting(true);
        fetch(`${API}/book`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form),
        })
            .then(r => r.json())
            .then(() => {
                setFeedback({ type: 'success', msg: 'Book added successfully!' });
                setForm({ title: '', author: '', publisher: '' });
                setShowForm(false);
                fetchBooks();
            })
            .catch(() => setFeedback({ type: 'danger', msg: 'Error adding book.' }))
            .finally(() => setSubmitting(false));
    };

    const handleDelete = id => {
        if (!confirm('Delete this book?')) return;
        fetch(`${API}/books/${id}`, { method: 'DELETE' })
            .then(r => r.json())
            .then(() => {
                setFeedback({ type: 'success', msg: 'Book deleted.' });
                fetchBooks();
            })
            .catch(() => setFeedback({ type: 'danger', msg: 'Error deleting book.' }));
    };

    return (
        <div className="page">
            <div className="page-header">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <h1 className="page-title">📖 Books</h1>
                        <p className="page-subtitle">Manage your library collection</p>
                    </div>
                    <button className="btn btn-primary" onClick={() => setShowForm(v => !v)}>
                        {showForm ? '✕ Cancel' : '＋ Add Book'}
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
                    <div className="panel-title">✏️ New Book</div>
                    <form onSubmit={handleAdd}>
                        <div className="grid-2">
                            <div className="form-group">
                                <label className="form-label">Title</label>
                                <input className="form-input" name="title" value={form.title} onChange={handleChange} placeholder="e.g. The Great Gatsby" required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Author</label>
                                <input className="form-input" name="author" value={form.author} onChange={handleChange} placeholder="e.g. F. Scott Fitzgerald" required />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Publisher</label>
                            <input className="form-input" name="publisher" value={form.publisher} onChange={handleChange} placeholder="e.g. Scribner" required />
                        </div>
                        <button className="btn btn-primary" type="submit" disabled={submitting}>
                            {submitting ? 'Saving…' : '💾 Save Book'}
                        </button>
                    </form>
                </div>
            )}

            <div className="card">
                <div className="card-header">
                    <span className="card-title">All Books</span>
                    <span className="badge badge-blue">{books.length} total</span>
                </div>

                {loading ? (
                    <div className="loading-spinner"><div className="spinner"></div></div>
                ) : error ? (
                    <div className="alert alert-danger">❌ {error}</div>
                ) : books.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">📭</div>
                        <p>No books yet. Add your first one!</p>
                    </div>
                ) : (
                    <div className="table-wrapper">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Title</th>
                                    <th>Author</th>
                                    <th>Publisher</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {books.map(b => (
                                    <tr key={b._id}>
                                        <td><span className="id-badge" title={b._id}>{b._id}</span></td>
                                        <td style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{b.title}</td>
                                        <td>{b.author}</td>
                                        <td>{b.publisher}</td>
                                        <td>
                                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(b._id)}>
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
