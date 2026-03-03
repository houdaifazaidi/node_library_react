import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function Home() {
    const [counts, setCounts] = useState({ books: '—', customers: '—', orders: '—' });

    useEffect(() => {
        Promise.allSettled([
            fetch('/api/books/books').then(r => r.json()),
            fetch('/api/customers/customers').then(r => r.json()),
            fetch('/api/orders/orders').then(r => r.json()),
        ]).then(([bRes, cRes, oRes]) => {
            setCounts({
                books: bRes.status === 'fulfilled' ? (bRes.value.books?.length ?? '—') : '—',
                customers: cRes.status === 'fulfilled' ? (cRes.value.customers?.length ?? '—') : '—',
                orders: oRes.status === 'fulfilled' ? (oRes.value.orders?.length ?? '—') : '—',
            });
        });
    }, []);

    const cards = [
        { to: '/books', icon: '📖', label: 'Books', value: counts.books, color: '#6c63ff' },
        { to: '/customers', icon: '👥', label: 'Customers', value: counts.customers, color: '#22c55e' },
        { to: '/orders', icon: '📦', label: 'Orders', value: counts.orders, color: '#f59e0b' },
    ];

    return (
        <div className="page">
            <div className="hero">
                <span className="hero-icon">📚</span>
                <h1 className="hero-title">
                    Welcome to{' '}
                    <span className="brand-gradient">LibraryHub</span>
                </h1>
                <p className="hero-subtitle">
                    Manage your books, customers, and orders from one beautiful dashboard.
                </p>

                <div className="stats-grid">
                    {cards.map(c => (
                        <Link
                            key={c.to}
                            to={c.to}
                            className="stat-card"
                            style={{ '--card-color': c.color }}
                        >
                            <div className="stat-icon">{c.icon}</div>
                            <div className="stat-label">{c.label}</div>
                            <div className="stat-value">{c.value}</div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
