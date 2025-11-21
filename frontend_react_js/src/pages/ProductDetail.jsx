import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../api/client';
import { useCart } from '../contexts/CartContext';

// PUBLIC_INTERFACE
export default function ProductDetail() {
  /** Product detail with image, description, quantity add-to-cart */
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    api.getProduct(id)
      .then(data => { if (mounted) setProduct(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
    return () => { mounted = false; };
  }, [id]);

  if (loading) return <p>Loading…</p>;
  if (!product) return <p>Product not found.</p>;

  return (
    <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{ aspectRatio: '1/1', background: '#eef2ff' }}>
          {product.image ? (
            <img src={product.image} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : null}
        </div>
      </div>
      <div className="stack">
        <h1 className="h1">{product.title}</h1>
        <div className="h2">${Number(product.price).toFixed(2)}</div>
        <p className="muted">{product.description || 'No description provided.'}</p>
        <div className="row">
          <label htmlFor="qty" className="visually-hidden">Quantity</label>
          <input id="qty" className="input" type="number" min="1" value={qty} onChange={e=>setQty(Math.max(1, Number(e.target.value)||1))} style={{ width: 100 }} />
          <button className="btn btn-secondary" onClick={()=>addItem(product, qty)} aria-label="Add to cart">Add to Cart</button>
        </div>
      </div>
    </div>
  );
}
