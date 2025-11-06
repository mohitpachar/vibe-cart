import React, { useEffect, useState } from 'react'
import Cart from '../components/Cart.jsx'
import * as api from '../lib/api.js'

export default function CartPage() {
  const [cart, setCart] = useState({ items: [], total: 0 })

  async function refresh() {
    const crt = await api.getCart()
    setCart(crt)
  }

  useEffect(() => { refresh() }, [])

  return (
    <div className="container" style={{marginTop:"20px"}}>
      <h2>Your Cart 🛒</h2>
      <div className="cart-panel">
        <Cart 
          cart={cart} 
          onRemove={async (id)=>{ setCart(await api.removeFromCart(id)) }} 
          onUpdateQty={async (id, qty)=>{ setCart(await api.updateCartQty(id, qty)) }} 
          onCheckout={async ()=>{ await api.checkout(); refresh(); }}
        />
      </div>
    </div>
  )
}
