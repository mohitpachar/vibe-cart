import React from 'react'

export default function CheckoutModal({ receipt, onClose }) {
  if (!receipt) return null
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <h2>Payment Successful (Mock)</h2>
        <p className="small">This is a simulated checkout. No real payments.</p>
        <p><strong>Receipt ID:</strong> {receipt.receiptId}</p>
        <p><strong>User:</strong> {receipt.user?.name} ({receipt.user?.email})</p>
        <p><strong>Timestamp:</strong> {new Date(receipt.timestamp).toLocaleString()}</p>
        <h3>Items</h3>
        <ul>
          {receipt.items.map((it, idx) => (
            <li key={idx}>{it.name} × {it.qty} — ₹{it.subtotal}</li>
          ))}
        </ul>
        <h3>Total: ₹{receipt.total}</h3>
        <div style={{marginTop:12}}>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  )
}
