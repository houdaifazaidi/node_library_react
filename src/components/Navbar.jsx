import { NavLink } from 'react-router-dom';

export default function Navbar() {
    return (
        <nav className="navbar">
            <NavLink to="/" className="navbar-brand">
                <span className="brand-icon">📚</span>
                <span>Library<span className="brand-gradient">Hub</span></span>
            </NavLink>

            <ul className="navbar-links">
                <li>
                    <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>
                        🏠 Home
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/books" className={({ isActive }) => isActive ? 'active' : ''}>
                        📖 Books
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/customers" className={({ isActive }) => isActive ? 'active' : ''}>
                        👥 Customers
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/orders" className={({ isActive }) => isActive ? 'active' : ''}>
                        📦 Orders
                    </NavLink>
                </li>
            </ul>
        </nav>
    );
}
