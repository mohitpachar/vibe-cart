import React from 'react'

export default function ProductGrid({ products, onAdd, user, onLoginRequired, onSelect }) {
  return (
    <div className="grid">
      {products.map(p => (
        <div 
          className="card" 
          key={p.id}
          onClick={() => onSelect(p)}  // ✅ Open product modal on card click
        >
          <img src={p.image} alt={p.name} />
          
          <div className="content">

            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', gap:8}}>
              <div style={{fontWeight:700}}>{p.name}</div>
              <div className="price">₹{p.price}</div>
            </div>

            {/* ✅ Add to Cart Button (does NOT open modal) */}
            <button 
              className="button"
              style={{marginTop: "auto"}} 
              onClick={(e) => {
                e.stopPropagation();   // ✅ Prevent triggering modal
                user ? onAdd(p.id, 1) : onLoginRequired();
              }}
            >
              Add to Cart 🛒
            </button>

          </div>
        </div>
      ))}
    </div>
  )
}
