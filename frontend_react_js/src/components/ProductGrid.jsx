import React from 'react';
import ProductCard from './ProductCard';

// PUBLIC_INTERFACE
export default function ProductGrid({ products, onAddToCart }) {
  /** Grid layout for product cards */
  if (!products?.length) return <p className="muted">No products found.</p>;
  return (
    <div className="grid grid-3">
      {products.map(p => (
        <ProductCard key={p.id} product={p} onAddToCart={onAddToCart} />
      ))}
    </div>
  );
}
