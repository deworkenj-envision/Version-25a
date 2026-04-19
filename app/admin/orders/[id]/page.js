"use client";

import { useEffect, useState } from "react";

export default function OrderPage({ params }) {
  const { id } = params;
  const [order, setOrder] = useState(null);

  useEffect(() => {
    fetch(`/api/orders/${id}`)
      .then((res) => res.json())
      .then((data) => setOrder(data.order));
  }, [id]);

  if (!order) return <div className="p-10">Loading...</div>;

  return (
    <div className="p-10 space-y-6">

      {/* HEADER */}
      <div className="bg-blue-900 text-white p-6 rounded-xl flex justify-between">
        <div>
          <div className="text-sm">ORDER NUMBER</div>
          <div className="text-xl font-bold">{order.order_number}</div>
        </div>

        <div>
          <div className="text-sm">CUSTOMER</div>
          <div className="font-semibold">{order.customer_name}</div>
        </div>

        <div>
          <div className="text-sm">EMAIL</div>
          <div>{order.customer_email}</div>
        </div>

        <div>
          <div className="text-sm">TOTAL</div>
          <div>${order.total}</div>
        </div>
      </div>

      {/* PRODUCT */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-gray-100 rounded-xl">
          <div className="text-sm">PRODUCT</div>
          <div className="font-bold">{order.product_name}</div>
        </div>

        <div className="p-4 bg-gray-100 rounded-xl">
          <div className="text-sm">QUANTITY</div>
          <div>{order.quantity}</div>
        </div>

        <div className="p-4 bg-gray-100 rounded-xl">
          <div className="text-sm">STATUS</div>
          <div>{order.status}</div>
        </div>
      </div>

      {/* BUTTONS */}
      <div className="flex gap-4">

        {/* ✅ THIS IS THE CORRECT BUTTON */}
        <a
          href={`/admin/orders/${order.id}/packing-slip`}
          target="_blank"
          className="bg-black text-white px-6 py-3 rounded"
        >
          Print Packing Slip
        </a>

        {/* KEEP YOUR ARTWORK BUTTON */}
        {order.artwork_url && (
          <a
            href={order.artwork_url}
            target="_blank"
            className="bg-blue-600 text-white px-6 py-3 rounded"
          >
            Open Sheet
          </a>
        )}

      </div>

    </div>
  );
}