import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

// PUBLIC_INTERFACE
export default function NavBar({ onToggleTheme, theme }) {
  /** Navigation bar with brand, links, cart count and theme toggle */
  const { count } = useCart();
  const { isAuthenticated, logout } = useAuth();

  return (
    <>
      <Link className="brand" to="/" aria-label="Go to homepage">
        <span className="brand-badge" aria-hidden>👗</span>
        <span>Elegance</span>
      </Link>
      <div className="nav-links" role="menubar" aria-label="Main menu">
        <NavLink className="nav-link" to="/" end>Home</NavLink>
        <NavLink className="nav-link" to="/shop">Shop</NavLink>
        <NavLink className="nav-link" to="/cart" aria-label={`Cart with ${count} items`}>
          Cart <span className="badge">{count}</span>
        </NavLink>
        {isAuthenticated ? (
          <>
            <NavLink className="nav-link" to="/admin">Admin</NavLink>
            <button className="btn btn-outline" onClick={logout} aria-label="Logout">Logout</button>
          </>
        ) : (
          <NavLink className="nav-link" to="/admin/login">Admin Login</NavLink>
        )}
        <button
          className="btn"
          onClick={onToggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? 'Dark' : 'Light'}
        </button>
      </div>
    </>
  );
}
