import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../api/client';
import ProductGrid from '../components/ProductGrid';
import { useCart } from '../contexts/CartContext';

// PUBLIC_INTERFACE
export default function Shop() {
  /** Shop page supports category filter, search, sort and simple pagination */
  const [searchParams, setSearchParams] = useSearchParams();
  const [data, setData] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(false);
  const { addItem } = useCart();
  const navigate = useNavigate();

  const page = Number(searchParams.get('page') || 1);
  const q = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || 'newest';
  const limit = 9;

  const query = useMemo(() => ({ page, limit, q, category, sort }), [page, q, category, sort]);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    api.listProducts(query)
      .then(res => {
        if (!mounted) return;
        if (Array.isArray(res)) setData({ items: res, total: res.length });
        else setData({ items: res.items || [], total: res.total || 0 });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
    return () => { mounted = false; };
  }, [query.page, query.q, query.category, query.sort]);

  const totalPages = Math.max(1, Math.ceil((data.total || 0) / limit));

  function updateParam(key, value) {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    if (key !== 'page') next.delete('page'); // reset page on filter change
    setSearchParams(next);
  }

  return (
    <div className="stack">
      <div className="card" style={{ padding: '1rem' }}>
        <form className="row" role="search" aria-label="Product search and filters" onSubmit={(e) => e.preventDefault()}>
          <label className="visually-hidden" htmlFor="q">Search</label>
          <input id="q" className="input" placeholder="Search products…" value={q} onChange={(e)=>updateParam('q', e.target.value)} />
          <select className="select" value={category} onChange={(e)=>updateParam('category', e.target.value)} aria-label="Category">
            <option value="">All categories</option>
            <option value="dresses">Dresses</option>
            <option value="tops">Tops</option>
            <option value="bottoms">Bottoms</option>
            <option value="outerwear">Outerwear</option>
          </select>
          <select className="select" value={sort} onChange={(e)=>updateParam('sort', e.target.value)} aria-label="Sort">
            <option value="newest">Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </form>
      </div>

      {loading ? <p>Loading…</p> :
        <ProductGrid products={data.items || []} onAddToCart={(p)=>addItem(p, 1)} />
      }

      <div className="row" style={{ justifyContent: 'center' }} role="navigation" aria-label="Pagination">
        <button className="btn btn-outline" disabled={page<=1} onClick={()=>updateParam('page', String(page-1))} aria-disabled={page<=1}>Prev</button>
        <span className="badge" aria-live="polite">Page {page} of {totalPages}</span>
        <button className="btn btn-outline" disabled={page>=totalPages} onClick={()=>updateParam('page', String(page+1))} aria-disabled={page>=totalPages}>Next</button>
      </div>
    </div>
  );
}
