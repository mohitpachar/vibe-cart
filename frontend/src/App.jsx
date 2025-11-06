import React, { useEffect, useState } from 'react'
import ProductGrid from './components/ProductGrid.jsx'
import Cart from './components/Cart.jsx'
import CheckoutModal from './components/CheckoutModal.jsx'
import AuthCard from './components/AuthCard.jsx'
import LoginPrompt from "./components/LoginPrompt.jsx";
import * as api from './lib/api.js'
import Toast from "./components/Toast.jsx";
import ProductModal from "./components/ProductModal.jsx";
import Orders from "./pages/Orders.jsx";


export default function App() {
  const [page, setPage] = useState("home")
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [toast, setToast] = useState(null)
  const [products, setProducts] = useState([])
  const [cart, setCart] = useState({ items: [], total: 0 })
  const [user, setUser] = useState(api.getStoredUser())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showReceipt, setShowReceipt] = useState(false)
  const [receipt, setReceipt] = useState(null)

  // Theme
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark")
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme)
    localStorage.setItem("theme", theme)
  }, [theme])
  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark")

  useEffect(() => { api.getProducts().then(setProducts).catch(()=>{}) }, [])

  useEffect(() => { if (user) refreshCart(); else setLoading(false) }, [user])

  async function refreshCart() {
    try {
      setLoading(true)
      setError('')
      const crt = await api.getCart()
      setCart(crt)
    } catch {
      setError('Failed to load. Ensure backend is running on :4000')
    }
    setLoading(false)
  }

  async function addToCart(productId, qty = 1) {
    const updated = await api.addToCart(productId, qty)
    setCart(updated)
    setToast("✅ Added to cart")
  }

  async function removeFromCart(cartId) {
    const updated = await api.removeFromCart(cartId)
    setCart(updated)
  }

  async function updateQty(cartId, qty) {
    const updated = await api.updateCartQty(cartId, qty)
    setCart(updated)
  }

  async function checkout() {
    const res = await api.checkout()
    setReceipt(res.receipt)
    setShowReceipt(true)
    await refreshCart()
  }

  function onAuth({ user, token }) {
    setUser(user);
    setShowAuth(false)
    setPage("home")
  }

  function logout() {
    api.logout()
    setUser(null)
    setCart({ items: [], total: 0 })
    setPage("home")
  }

  return (
    <div className="container">
      
      {/* HEADER */}
      <header className="header">
        <div className="brand" onClick={() => setPage("home")} style={{cursor:"pointer"}}>Vibe Cart</div>

        <div className="header-right">
          <button className="secondary" onClick={toggleTheme}>
            {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
          </button>

          <button 
            className="secondary"
            onClick={() => user ? setPage("cart") : setShowLoginPrompt(true)}
          >
            Cart 🛍️
          </button>

          {user ? (
            <>
              <div className="profile-menu">
                <span className="profile-name">{user.name}</span>
                <div className="profile-dropdown">
                  <button onClick={() => setPage("orders")}>📦 My Orders</button>
                  <button onClick={logout}>🚪 Logout</button>
                </div>
              </div>
            </>
          ) : (
            <button className="button" onClick={() => setShowAuth(true)}>Login</button>
          )}
        </div>
      </header>

      {/* LOGIN MODALS */}
      {showAuth && <AuthCard onAuth={onAuth} onClose={() => setShowAuth(false)} />}
      {showLoginPrompt && (
        <LoginPrompt 
          onClose={() => setShowLoginPrompt(false)}
          onLogin={() => { setShowLoginPrompt(false); setShowAuth(true); }}
        />
      )}

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      {/* HOME PAGE */}
      {page === "home" && (
        <>
          <h2>Products</h2>
          <ProductGrid 
            products={products} 
            onAdd={addToCart} 
            user={user}
            onLoginRequired={() => setShowLoginPrompt(true)}
            onSelect={setSelectedProduct}
          />
        </>
      )}

      {/* CART PAGE */}
      {page === "cart" && user && (
        <div className="cart-panel" style={{marginTop:"20px"}}>
          <h2>Your Cart 🛒</h2>
          <Cart 
            cart={cart} 
            onRemove={removeFromCart} 
            onUpdateQty={updateQty} 
            onCheckout={checkout} 
          />
        </div>
      )}

      {page === "orders" && user && <Orders />}


      {error && <p style={{color:'#fca5a5'}}>{error}</p>}
      {loading && <p>Loading...</p>}
      {showReceipt && <CheckoutModal receipt={receipt} onClose={() => setShowReceipt(false)} />}

      {/* ✅ GLASS PRODUCT MODAL */}
      {selectedProduct && (
        <ProductModal 
          product={selectedProduct}
          onAdd={addToCart}
          user={user}
          onLoginRequired={() => setShowLoginPrompt(true)}
          onClose={() => setSelectedProduct(null)}
        />
      )}

    </div>
  )
}