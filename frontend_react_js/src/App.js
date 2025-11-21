import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './contexts/CartContext';
import { AuthProvider } from './contexts/AuthContext';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import AdminLogin from './pages/AdminLogin';
import AdminPanel from './pages/AdminPanel';

// PUBLIC_INTERFACE
function App() {
  /** Root app which sets theme, provides global contexts and registers routes. */
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => setTheme(t => (t === 'light' ? 'dark' : 'light'));

  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <nav className="navbar" role="navigation" aria-label="Primary">
              <div className="container navbar-inner">
                <NavBar onToggleTheme={toggleTheme} theme={theme} />
              </div>
            </nav>
            <main>
              <div className="container" style={{ paddingTop: '1rem', paddingBottom: '2rem' }}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route path="/admin" element={<AdminPanel />} />
                </Routes>
              </div>
            </main>
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
