import React from "react";

export default function LoginPrompt({ onClose, onLogin }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="auth-modal" onClick={e => e.stopPropagation()}>
        
        <h2>Login Required 🔐</h2>
        <p style={{marginTop: 8}}>You must log in to add products to your cart.</p>

        <div style={{display:"flex", gap:"10px", marginTop:"14px"}}>
          <button className="button" onClick={onLogin}>Login</button>
          <button className="secondary" onClick={onClose}>Cancel</button>
        </div>

      </div>
    </div>
  );
}
