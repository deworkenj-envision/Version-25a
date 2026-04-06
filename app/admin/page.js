"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch("/api/orders")
      .then((res) => res.json())
      .then((data) => setOrders(data.orders || []));
  }, []);

  const totalOrders = orders.length;
  const revenue = orders.reduce((sum, o) => sum + Number(o.total || 0), 0);

  const paid = orders.filter((o) => o.status === "paid").length;
  const printing = orders.filter((o) => o.status === "printing").length;
  const shipped = orders.filter((o) => o.status === "shipped").length;

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Admin Dashboard</h1>

      {/* STATS */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <Stat title="Total Orders" value={totalOrders} />
        <Stat title="Revenue" value={`$${revenue.toFixed(2)}`} />
        <Stat title="Printing" value={printing} />
        <Stat title="Shipped" value={shipped} />
      </div>

      {/* QUICK ACTION */}
      <div className="bg-white border rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-2">Orders</h2>
        <p className="text-sm text-gray-500 mb-4">
          Manage and update all customer orders
        </p>

        <Link
          href="/admin/orders"
          className="inline-block bg-black text-white px-5 py-3 rounded-lg"
        >
          Go to Orders →
        </Link>
      </div>
    </div>
  );
}

function Stat({ title, value }) {
  return (
    <div className="bg-white border rounded-xl p-4 shadow-sm">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="text-xl font-semibold mt-1">{value}</div>
    </div>
  );
}