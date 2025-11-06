import React from 'react'

export default function Cart({ cart, onRemove, onUpdateQty, onCheckout }) {
  return (
    <div>
      <h2>Cart</h2>
      {cart.items.length === 0 && <p>Your cart is empty.</p>}
      {cart.items.map(it => (
        <div className="cart-item" key={it.cartId}>
          <img src={it.image} alt={it.name} />
          <div>
            <div style={{fontWeight:700}}>{it.name}</div>
            <div className="small">₹{it.price} × {it.qty} = ₹{it.subtotal}</div>
            <div className="row" style={{marginTop:8}}>
              <input className="qty-input" type="number" min="1" value={it.qty} onChange={e => onUpdateQty(it.cartId, e.target.value)} />
              <button className="secondary" onClick={() => onRemove(it.cartId)}>Remove</button>
            </div>
          </div>
          <div>₹{it.subtotal}</div>
        </div>
      ))}

      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:12}}>
        <div style={{fontWeight:800, fontSize:18}}>Total: ₹{cart.total}</div>
        <button onClick={() => onCheckout()} disabled={cart.items.length === 0}>Pay (Mock)</button>
      </div>
    </div>
  )
}
