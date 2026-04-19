"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function PackingSlipPage() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (!id) return;

    async function load() {
      try {
        const res = await fetch(`/api/orders/${id}`, {
          cache: "no-store",
        });

        const data = await res.json();

        const o = data.order || data;

        setOrder(o);

        // trigger print AFTER data loads
        setTimeout(() => {
          window.print();
        }, 500);

      } catch (err) {
        console.error(err);
      }
    }

    load();
  }, [id]);

  if (!order) {
    return <div style={{ padding: 40 }}>Loading...</div>;
  }

  return (
    <div style={{ background: "white", color: "black", padding: 40 }}>
      <div style={{ maxWidth: 800, margin: "0 auto", border: "1px solid #ccc", padding: 30 }}>

        <h1 style={{ fontSize: 28, fontWeight: "bold" }}>EnVision Direct</h1>
        <h2 style={{ marginBottom: 20 }}>Packing Slip</h2>

        <p><strong>Order #:</strong> {order.order_number}</p>
        <p><strong>Date:</strong> {new Date(order.created_at).toLocaleDateString()}</p>

        <div style={{ marginTop: 20 }}>
          <h3>Customer</h3>
          <p>{order.customer_name}</p>
          <p>{order.customer_email}</p>
        </div>

        <div style={{ marginTop: 20 }}>
          <h3>Product</h3>
          <p>{order.product_name}</p>
          <p>
            {order.size} / {order.paper} / {order.finish} / {order.sides}
          </p>
          <p>Qty: {order.quantity}</p>
        </div>

        <div style={{ marginTop: 20 }}>
          <h3>Shipping</h3>
          <p>Carrier: {order.tracking_carrier || "N/A"}</p>
          <p>Tracking: {order.tracking_number || "N/A"}</p>
        </div>

      </div>
    </div>
  );
}