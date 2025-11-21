import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../api/client';

// PUBLIC_INTERFACE
export default function AdminPanel() {
  /** Admin panel with Inventory CRUD and Orders list/status update (placeholder wiring) */
  const { isAuthenticated } = useAuth();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Inventory form state
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const p = await api.listProducts({ limit: 50 });
        const items = Array.isArray(p) ? p : (p.items || []);
        const o = await api.listOrders({ limit: 50 });
        const oItems = Array.isArray(o) ? o : (o.items || []);
        if (mounted) {
          setProducts(items);
          setOrders(oItems);
        }
      } catch {
        // ignore errors for placeholders
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  if (!isAuthenticated) {
    return <p>You must be logged in to view the admin panel.</p>;
  }
  if (loading) return <p>Loading…</p>;

  async function submitProduct(e) {
    e.preventDefault();
    try {
      if (editing) {
        await api.updateProduct(editing.id, { title, price: Number(price), image });
      } else {
        await api.createProduct({ title, price: Number(price), image });
      }
      const p = await api.listProducts({ limit: 50 });
      setProducts(Array.isArray(p) ? p : (p.items || []));
      setTitle(''); setPrice(''); setImage(''); setEditing(null);
    } catch (err) {
      alert(err.message || 'Failed to save product');
    }
  }

  async function deleteProduct(id) {
    try {
      await api.deleteProduct(id);
      const p = await api.listProducts({ limit: 50 });
      setProducts(Array.isArray(p) ? p : (p.items || []));
    } catch (err) {
      alert(err.message || 'Failed to delete product');
    }
  }

  async function updateOrder(id, status) {
    try {
      await api.updateOrderStatus(id, status);
      const o = await api.listOrders({ limit: 50 });
      setOrders(Array.isArray(o) ? o : (o.items || []));
    } catch (err) {
      alert(err.message || 'Failed to update order status');
    }
  }

  function startEdit(p) {
    setEditing(p);
    setTitle(p.title || '');
    setPrice(String(p.price || ''));
    setImage(p.image || '');
  }

  return (
    <div className="stack">
      <section className="card" style={{ padding: '1rem' }}>
        <h2 className="h2">{editing ? 'Edit Product' : 'Add Product'}</h2>
        <form className="form-row" onSubmit={submitProduct}>
          <div className="stack">
            <label htmlFor="title">Title</label>
            <input id="title" className="input" value={title} onChange={e=>setTitle(e.target.value)} required />
          </div>
          <div className="stack">
            <label htmlFor="price">Price</label>
            <input id="price" className="input" type="number" step="0.01" value={price} onChange={e=>setPrice(e.target.value)} required />
          </div>
          <div className="stack" style={{ gridColumn: '1 / -1' }}>
            <label htmlFor="image">Image URL</label>
            <input id="image" className="input" value={image} onChange={e=>setImage(e.target.value)} />
          </div>
          <div className="row" style={{ gridColumn: '1 / -1' }}>
            <button className="btn" type="submit">{editing ? 'Update' : 'Create'}</button>
            {editing ? <button type="button" className="btn btn-outline" onClick={()=>{ setEditing(null); setTitle(''); setPrice(''); setImage(''); }}>Cancel</button> : null}
          </div>
        </form>
      </section>

      <section className="card" style={{ padding: '1rem' }}>
        <h2 className="h2">Inventory</h2>
        <table className="table">
          <thead><tr><th>Title</th><th>Price</th><th>Image</th><th></th></tr></thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id}>
                <td>{p.title}</td>
                <td>${Number(p.price).toFixed(2)}</td>
                <td>{p.image ? <a href={p.image} target="_blank" rel="noreferrer">Open</a> : '-'}</td>
                <td className="row">
                  <button className="btn btn-outline" onClick={()=>startEdit(p)}>Edit</button>
                  <button className="btn btn-outline" onClick={()=>deleteProduct(p.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="card" style={{ padding: '1rem' }}>
        <h2 className="h2">Orders</h2>
        <table className="table">
          <thead><tr><th>ID</th><th>Customer</th><th>Total</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.id}>
                <td>{o.id}</td>
                <td>{o.customer?.name || '-'}</td>
                <td>${Number(o.total || 0).toFixed(2)}</td>
                <td><span className="badge">{o.status || 'pending'}</span></td>
                <td className="row">
                  <button className="btn btn-outline" onClick={()=>updateOrder(o.id, 'processing')}>Processing</button>
                  <button className="btn btn-outline" onClick={()=>updateOrder(o.id, 'shipped')}>Shipped</button>
                  <button className="btn btn-outline" onClick={()=>updateOrder(o.id, 'delivered')}>Delivered</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
