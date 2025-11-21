import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { api } from '../api/client';

// PUBLIC_INTERFACE
export default function Checkout() {
  /** Checkout page with simple form; posts order to backend placeholder endpoint */
  const { items, clear, subtotal } = useCart();
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  async function placeOrder(e) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      await api.createOrder({ customer: { name, address }, items, total: subtotal });
      setStatus({ type: 'success', message: 'Order placed successfully!' });
      clear();
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Failed to place order.' });
    } finally {
      setLoading(false);
    }
  }

  if (!items.length) return <p>Your cart is empty.</p>;

  return (
    <div className="grid" style={{ gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
      <form className="card stack" onSubmit={placeOrder} style={{ padding: '1rem' }}>
        <h2 className="h2">Shipping</h2>
        <div className="form-row">
          <div className="stack">
            <label htmlFor="name">Name</label>
            <input id="name" className="input" value={name} onChange={e=>setName(e.target.value)} required />
          </div>
          <div className="stack">
            <label htmlFor="address">Address</label>
            <input id="address" className="input" value={address} onChange={e=>setAddress(e.target.value)} required />
          </div>
        </div>
        {status ? <div className="badge" role="status" style={{ color: status.type==='error'?'#b91c1c':'inherit' }}>{status.message}</div> : null}
        <button className="btn" type="submit" disabled={loading}>{loading ? 'Placing…' : 'Place Order'}</button>
      </form>
      <aside className="card" style={{ padding: '1rem', alignSelf: 'start' }}>
        <h2 className="h2">Summary</h2>
        <div className="stack">
          {items.map(i => (
            <div key={`${i.id}-${i.variantId || 'base'}`} className="row" style={{ justifyContent: 'space-between' }}>
              <span>{i.title} × {i.quantity}</span>
              <strong>${(i.price * i.quantity).toFixed(2)}</strong>
            </div>
          ))}
          <div className="row" style={{ justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '.5rem' }}>
            <span>Total</span>
            <strong>${subtotal.toFixed(2)}</strong>
          </div>
        </div>
      </aside>
    </div>
  );
}
