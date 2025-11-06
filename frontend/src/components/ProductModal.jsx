import React from "react";

export default function ProductModal({ product, onAdd, onClose, user, onLoginRequired }) {
  if (!product) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="product-modal" onClick={e => e.stopPropagation()}>

        <button className="close-btn" onClick={onClose}>✖</button>

        <img src={product.image} className="modal-image" alt="" />

        <h2>{product.name}</h2>
        <p className="modal-price">₹ {product.price}</p>

        <p className="modal-desc">
          Experience premium quality and modern design with long-lasting durability.
        </p>

        <button 
          className="button" 
          onClick={() => user ? onAdd(product.id, 1) : onLoginRequired()}
          style={{width:"100%", marginTop:"10px"}}
        >
          Add to Cart 🛒
        </button>

      </div>
    </div>
  );
}
