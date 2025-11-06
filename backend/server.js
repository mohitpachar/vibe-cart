import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';
const app = express();
app.use(cors());
app.use(express.json());

let db;
async function initDb() {
  db = await open({
    filename: './vibe.db',
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      price REAL NOT NULL,
      image TEXT
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS cart (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      qty INTEGER NOT NULL CHECK(qty > 0),
      FOREIGN KEY(product_id) REFERENCES products(id),
      FOREIGN KEY(user_id) REFERENCES users(id)
    );
  `);

  await db.exec(`
  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    total REAL NOT NULL,
    created_at TEXT NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );
`);

await db.exec(`
  CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    qty INTEGER NOT NULL,
    price REAL NOT NULL,
    FOREIGN KEY(order_id) REFERENCES orders(id),
    FOREIGN KEY(product_id) REFERENCES products(id)
  );
`);


  

  const row = await db.get('SELECT COUNT(*) as c FROM products');
  if (row.c === 0) {
    const seed = [
      {id:1, name:'Wireless Headphones', price:1999, image:'https://picsum.photos/seed/hp/600/400'},
      {id:2, name:'Fitness Band', price:1499, image:'https://picsum.photos/seed/fb/600/400'},
      {id:3, name:'Bluetooth Speaker', price:1299, image:'https://picsum.photos/seed/sp/600/400'},
      {id:4, name:'Smartwatch', price:2499, image:'https://picsum.photos/seed/sw/600/400'},
      {id:5, name:'USB-C Charger', price:799, image:'https://picsum.photos/seed/uc/600/400'},
      {id:6, name:'Laptop Stand', price:999, image:'https://picsum.photos/seed/ls/600/400'},
      {id:7, name:'Mechanical Keyboard', price:2999, image:'https://picsum.photos/seed/mk/600/400'},
      {id:8, name:'Wireless Mouse', price:899, image:'https://picsum.photos/seed/wm/600/400'}
    ];
    const insert = await db.prepare('INSERT INTO products (id, name, price, image) VALUES (?, ?, ?, ?)');
    for (const p of seed) {
      await insert.run(p.id, p.name, p.price, p.image);
    }
    await insert.finalize();
    console.log('Seeded products');
  }
}

// ---- Auth helpers ----
function signToken(user) {
  return jwt.sign({ uid: user.id, name: user.name, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
}

function auth(req, res, next) {
  const h = req.headers['authorization'] || '';
  const token = h.startsWith('Bearer ') ? h.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Missing token' });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

async function getCartWithTotals(userId) {
  const items = await db.all(`
    SELECT c.id as cartId, p.id as productId, p.name, p.price, p.image, c.qty,
           (p.price * c.qty) as subtotal
    FROM cart c
    JOIN products p ON p.id = c.product_id
    WHERE c.user_id = ?
    ORDER BY c.id DESC
  `, [userId]);

  const total = items.reduce((sum, it) => sum + it.subtotal, 0);
  return { items, total };
}

// ---- Routes ----

// Health
app.get('/api/health', (req, res) => res.json({ ok: true, time: new Date().toISOString() }));

// Public: list products
app.get('/api/products', async (req, res) => {
  try {
    const rows = await db.all('SELECT * FROM products ORDER BY id ASC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'name, email, password required' });
    const existing = await db.get('SELECT id FROM users WHERE email = ?', [email.toLowerCase()]);
    if (existing) return res.status(409).json({ error: 'Email already registered' });
    const hash = await bcrypt.hash(password, 10);
    const r = await db.run('INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)', [name, email.toLowerCase(), hash]);
    const user = { id: r.lastID, name, email: email.toLowerCase() };
    const token = signToken(user);
    res.status(201).json({ user, token });
  } catch (err) { console.error(err); res.status(500).json({ error: 'Registration failed' }); }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'email, password required' });
    const user = await db.get('SELECT * FROM users WHERE email = ?', [email.toLowerCase()]);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
    const token = signToken(user);
    res.json({ user: { id: user.id, name: user.name, email: user.email }, token });
  } catch (err) { console.error(err); res.status(500).json({ error: 'Login failed' }); }
});

// Protected Cart
app.get('/api/cart', auth, async (req, res) => {
  try {
    const cart = await getCartWithTotals(req.user.uid);
    res.json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
});

app.post('/api/cart', auth, async (req, res) => {
  try {
    const { productId, qty } = req.body;
    if (!productId || !qty || qty <= 0) return res.status(400).json({ error: 'productId and positive qty required' });
    const product = await db.get('SELECT id FROM products WHERE id = ?', [productId]);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    const existing = await db.get('SELECT id, qty FROM cart WHERE user_id = ? AND product_id = ?', [req.user.uid, productId]);
    if (existing) await db.run('UPDATE cart SET qty = qty + ? WHERE id = ?', [qty, existing.id]);
    else await db.run('INSERT INTO cart (user_id, product_id, qty) VALUES (?, ?, ?)', [req.user.uid, productId, qty]);
    const cart = await getCartWithTotals(req.user.uid);
    res.status(201).json(cart);
  } catch (err) { console.error(err); res.status(500).json({ error: 'Failed to add to cart' }); }
});

app.patch('/api/cart/:id', auth, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { qty } = req.body;
    if (isNaN(id) || !qty || qty <= 0) return res.status(400).json({ error: 'Valid qty required' });
    await db.run('UPDATE cart SET qty = ? WHERE id = ? AND user_id = ?', [qty, id, req.user.uid]);
    const cart = await getCartWithTotals(req.user.uid);
    res.json(cart);
  } catch (err) { console.error(err); res.status(500).json({ error: 'Failed to update quantity' }); }
});

app.delete('/api/cart/:id', auth, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ error: 'Invalid cart id' });
    await db.run('DELETE FROM cart WHERE id = ? AND user_id = ?', [id, req.user.uid]);
    const cart = await getCartWithTotals(req.user.uid);
    res.json(cart);
  } catch (err) { console.error(err); res.status(500).json({ error: 'Failed to remove cart item' }); }
});

app.post('/api/checkout', auth, async (req, res) => {
  try {
    const rows = await db.all(`
      SELECT c.product_id, c.qty, p.name, p.price
      FROM cart c
      JOIN products p ON c.product_id = p.id
      WHERE c.user_id = ?
    `, [req.user.uid]);

    if (rows.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    const total = rows.reduce((sum, r) => sum + r.qty * r.price, 0);
    const timestamp = new Date().toISOString();

    const result = await db.run(
      `INSERT INTO orders (user_id, total, created_at) VALUES (?, ?, ?)`,
      [req.user.uid, total, timestamp]
    );
    const orderId = result.lastID;

    for (const r of rows) {
      await db.run(
        `INSERT INTO order_items (order_id, product_id, qty, price) VALUES (?, ?, ?, ?)`,
        [orderId, r.product_id, r.qty, r.price]
      );
    }

    await db.run(`DELETE FROM cart WHERE user_id = ?`, [req.user.uid]);

    res.json({ ok: true, receipt: { orderId, total, timestamp, items: rows } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Checkout failed" });
  }
});



// ✅ Get all past orders for logged-in user
app.get('/api/orders', auth, async (req, res) => {
  try {
    console.log("🔍 Logged-in user from token:", req.user); // Debug
    const userId = req.user.uid;  // JWT stores uid
    
    console.log("🔍 Querying orders for user_id =", userId);

    const orders = await db.all(
      `SELECT * FROM orders WHERE user_id = ? ORDER BY id DESC`,
      [userId]
    );

    console.log("📦 Orders found:", orders);

    res.json({ orders });
  } catch (err) {
    console.error("❌ Error loading orders:", err);
    res.status(500).json({ error: "Failed to load orders" });
  }
});





const PORT = process.env.PORT || 4000;
initDb().then(() => {
  app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
}).catch(err => {
  console.error('DB init failed', err);
  process.exit(1);
});
