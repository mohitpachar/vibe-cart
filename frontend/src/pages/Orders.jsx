import React, { useEffect, useState } from "react";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
  async function load() {
    try {
      const token = localStorage.getItem("vibe_token_v2");
      console.log("🔑 Stored Token:", token);

      const res = await fetch("http://localhost:4000/api/orders", {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();
      console.log("📦 Orders Response:", data);

      setOrders(data.orders || []);
    } catch (err) {
      console.error("Failed to load orders", err);
    }
  }
  load();
}, []);


  return (
    <div className="container" style={{ marginTop: "20px" }}>
      <h2>Your Orders 📦</h2>

      {orders.length === 0 && <p>No past orders yet.</p>}

      {orders.map((o) => (
        <div key={o.id} className="cart-panel" style={{ marginTop: "12px" }}>
          <div><strong>Order #{o.id}</strong></div>
          <div>Total: ₹{o.total}</div>
          <div>Date: {new Date(o.created_at).toLocaleString()}</div>
        </div>
      ))}
    </div>
  );
}
