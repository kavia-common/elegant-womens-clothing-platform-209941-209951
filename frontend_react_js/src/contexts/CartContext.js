/* CartContext manages cart state with localStorage persistence */
import React, { createContext, useContext, useEffect, useMemo, useReducer } from 'react';

const CartContext = createContext(null);

const STORAGE_KEY = 'ecom_cart_v1';

function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
function saveCart(items) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch { /* ignore */ }
}

function reducer(state, action) {
  switch (action.type) {
    case 'INIT':
      return Array.isArray(action.payload) ? action.payload : [];
    case 'ADD': {
      const { product, quantity } = action.payload;
      const existing = state.find(i => i.id === product.id && i.variantId === (product.variantId || null));
      let next;
      if (existing) {
        next = state.map(i => i === existing ? { ...i, quantity: i.quantity + quantity } : i);
      } else {
        next = [...state, { id: product.id, title: product.title, price: product.price, image: product.image, variantId: product.variantId || null, quantity }];
      }
      saveCart(next);
      return next;
    }
    case 'UPDATE': {
      const { id, variantId = null, quantity } = action.payload;
      const next = state.map(i => (i.id === id && i.variantId === variantId) ? { ...i, quantity } : i).filter(i => i.quantity > 0);
      saveCart(next);
      return next;
    }
    case 'REMOVE': {
      const { id, variantId = null } = action.payload;
      const next = state.filter(i => !(i.id === id && i.variantId === variantId));
      saveCart(next);
      return next;
    }
    case 'CLEAR':
      saveCart([]);
      return [];
    default:
      return state;
  }
}

// PUBLIC_INTERFACE
export function CartProvider({ children }) {
  /** Provides cart actions: addItem, updateItem, removeItem, clear, with totals */
  const [items, dispatch] = useReducer(reducer, []);

  useEffect(() => {
    dispatch({ type: 'INIT', payload: loadCart() });
  }, []);

  const addItem = (product, quantity = 1) => dispatch({ type: 'ADD', payload: { product, quantity } });
  const updateItem = (id, quantity, variantId = null) => dispatch({ type: 'UPDATE', payload: { id, variantId, quantity } });
  const removeItem = (id, variantId = null) => dispatch({ type: 'REMOVE', payload: { id, variantId } });
  const clear = () => dispatch({ type: 'CLEAR' });

  const count = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const value = useMemo(() => ({
    items, addItem, updateItem, removeItem, clear, count, subtotal
  }), [items, count, subtotal]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// PUBLIC_INTERFACE
export function useCart() {
  /** Hook to access cart context safely */
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
