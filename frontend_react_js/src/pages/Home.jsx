import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import ProductGrid from '../components/ProductGrid';
import { useCart } from '../contexts/CartContext';

// PUBLIC_INTERFACE
export default function Home() {
  /** Home page showcasing featured products */
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();

  useEffect(() => {
    let mounted = true;
    api.listProducts({ featured: true, limit: 6 })
      .then(data => {
        if (!mounted) return;
        setFeatured(Array.isArray(data?.items) ? data.items : data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
    return () => { mounted = false; };
  }, []);

  return (
    <div className="stack">
      <section className="card" style={{ padding: '1.2rem' }}>
        <h1 className="h1">Discover Elegance</h1>
        <p className="muted">Modern styles for every occasion. Blue & amber accents guide a refined shopping experience.</p>
      </section>
      <section className="stack">
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <h2 className="h2">Featured</h2>
        </div>
        {loading ? <p>Loading…</p> : <ProductGrid products={featured || []} onAddToCart={(p) => addItem(p, 1)} />}
      </section>
    </div>
  );
}
