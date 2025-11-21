/* Centralized API client that reads base URL from env and attaches auth token */

const API_BASE =
  process.env.REACT_APP_API_BASE ||
  process.env.REACT_APP_BACKEND_URL ||
  '';

/**
 * Build a URL with query params
 */
function withQuery(path, params = {}) {
  const url = new URL((API_BASE || '') + path, window.location.origin);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, v);
  });
  return url.toString().replace(window.location.origin, '');
}

/**
 * Get stored token from localStorage
 */
function getToken() {
  try {
    const raw = localStorage.getItem('auth_token');
    return raw || null;
  } catch {
    return null;
  }
}

/**
 * Low-level request helper with JSON handling and auth header.
 */
// PUBLIC_INTERFACE
export async function apiRequest(path, { method = 'GET', params, body, headers } = {}) {
  /** Perform an API request with optional query params and JSON body. */
  const url = params ? withQuery(path, params) : (API_BASE || '') + path;
  const token = getToken();

  const finalHeaders = {
    'Content-Type': 'application/json',
    ...(headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(url, {
    method,
    headers: finalHeaders,
    body: body ? JSON.stringify(body) : undefined,
    credentials: 'include',
  });

  const contentType = res.headers.get('content-type') || '';
  const isJSON = contentType.includes('application/json');
  const data = isJSON ? await res.json().catch(() => ({})) : await res.text();

  if (!res.ok) {
    const message = (isJSON && data && (data.message || data.error)) || res.statusText;
    const error = new Error(message);
    error.status = res.status;
    error.data = data;
    throw error;
  }
  return data;
}

// PUBLIC_INTERFACE
export const api = {
  /** Auth endpoints */
  login: (email, password) => apiRequest('/api/admin/login', { method: 'POST', body: { email, password } }),
  logout: () => apiRequest('/api/admin/logout', { method: 'POST' }),

  /** Products listing/detail with filters */
  listProducts: (opts) => apiRequest('/api/products', { params: opts }),
  getProduct: (id) => apiRequest(`/api/products/${id}`),

  /** Cart/Orders - placeholders */
  createOrder: (payload) => apiRequest('/api/orders', { method: 'POST', body: payload }),
  listOrders: (opts) => apiRequest('/api/orders', { params: opts }),
  updateOrderStatus: (id, status) => apiRequest(`/api/orders/${id}/status`, { method: 'PUT', body: { status } }),

  /** Admin inventory CRUD (placeholders) */
  createProduct: (payload) => apiRequest('/api/admin/products', { method: 'POST', body: payload }),
  updateProduct: (id, payload) => apiRequest(`/api/admin/products/${id}`, { method: 'PUT', body: payload }),
  deleteProduct: (id) => apiRequest(`/api/admin/products/${id}`, { method: 'DELETE' }),
};
