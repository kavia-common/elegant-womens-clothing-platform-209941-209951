import React from 'react';
import { Link } from 'react-router-dom';

// PUBLIC_INTERFACE
export default function ProductCard({ product, onAddToCart }) {
  /** Card view for a product with image, title, price and add-to-cart */
  return (
    <div className="card" style={{ overflow: 'hidden' }}>
      <Link to={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
        <div style={{ aspectRatio: '1/1', background: '#eef2ff' }}>
          {product.image ? (
            <img
              src={product.image}
              alt={product.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : null}
        </div>
      </Link>
      <div style={{ padding: '0.8rem' }} className="stack">
        <div className="h3" style={{ fontWeight: 700 }}>{product.title}</div>
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <div className="h3" aria-label={`Price ${product.price}`}>${Number(product.price).toFixed(2)}</div>
          <button className="btn btn-secondary" onClick={() => onAddToCart(product)} aria-label={`Add ${product.title} to cart`}>
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
