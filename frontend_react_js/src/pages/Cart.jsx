import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

// PUBLIC_INTERFACE
export default function Cart() {
  /** Cart page showing items with ability to update or remove and proceed to checkout */
  const { items, updateItem, removeItem, subtotal } = useCart();

  if (!items.length) {
    return (
      <div className="card" style={{ padding: '1rem' }}>
        <p>Your cart is empty.</p>
        <Link className="btn btn-outline" to="/shop">Browse products</Link>
      </div>
    );
  }

  return (
    <div className="grid" style={{ gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
      <div className="card" style={{ padding: '1rem' }}>
        <table className="table" role="table" aria-label="Cart items">
          <thead>
            <tr><th>Product</th><th>Price</th><th>Qty</th><th>Total</th><th></th></tr>
          </thead>
          <tbody>
            {items.map(i => (
              <tr key={`${i.id}-${i.variantId || 'base'}`}>
                <td>{i.title}</td>
                <td>${Number(i.price).toFixed(2)}</td>
                <td>
                  <input
                    className="input"
                    type="number"
                    min="1"
                    value={i.quantity}
                    onChange={(e)=>updateItem(i.id, Math.max(1, Number(e.target.value)||1), i.variantId)}
                    style={{ width: 80 }}
                    aria-label={`Quantity for ${i.title}`}
                  />
                </td>
                <td>${(i.price * i.quantity).toFixed(2)}</td>
                <td><button className="btn btn-outline" onClick={()=>removeItem(i.id, i.variantId)} aria-label={`Remove ${i.title}`}>Remove</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <aside className="card" style={{ padding: '1rem', alignSelf: 'start' }}>
        <h2 className="h2">Summary</h2>
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <span>Subtotal</span><strong>${subtotal.toFixed(2)}</strong>
        </div>
        <div className="spacer" />
        <Link className="btn" to="/checkout" aria-label="Proceed to checkout">Checkout</Link>
      </aside>
    </div>
  );
}
