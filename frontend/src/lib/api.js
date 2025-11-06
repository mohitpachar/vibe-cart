const storageKey = 'vibe_token_v2';
const userKey = 'vibe_user_v2';

let token = localStorage.getItem(storageKey) || null;
let user = JSON.parse(localStorage.getItem(userKey) || 'null');

export function getStoredUser() {
  return user;
}

export function setAuth(t, u) {
  token = t;
  user = u;
  localStorage.setItem(storageKey, token);
  localStorage.setItem(userKey, JSON.stringify(user));
}

export function logout() {
  token = null;
  user = null;
  localStorage.removeItem(storageKey);
  localStorage.removeItem(userKey);
}

const API_BASE = "http://localhost:4000";

async function request(path, options = {}) {
  options.headers = options.headers || {};

  if (token) options.headers['Authorization'] = 'Bearer ' + token;

  const url = path.startsWith("http") ? path : API_BASE + path;
  const r = await fetch(url, options);

  if (!r.ok) {
    let msg = 'Request failed';
    try { const j = await r.json(); msg = j.error || msg } catch {}
    throw new Error(msg);
  }

  return r.json();
}


// ---------- API FUNCTIONS ----------

export async function getProducts() {
  return request('/api/products');
}

export async function register(name, email, password) {
  const res = await request('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  });

  setAuth(res.token, res.user);
  return { user: res.user, token: res.token };
}

export async function login(email, password) {
  const res = await request('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  setAuth(res.token, res.user);
  return { user: res.user, token: res.token };
}


// Cart APIs
export async function getCart() {
  return request('/api/cart');
}

export async function addToCart(productId, qty = 1) {
  return request('/api/cart', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productId, qty })
  });
}

export async function removeFromCart(cartId) {
  return request('/api/cart/' + cartId, { method: 'DELETE' });
}

export async function updateCartQty(cartId, qty) {
  return request('/api/cart/' + cartId, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ qty: Number(qty) })
  });
}

export async function checkout() {
  return request('/api/checkout', { method: 'POST' });
}


// ✅ Orders API (this was missing!)
export async function getOrders() {
  return request('/api/orders');
}
