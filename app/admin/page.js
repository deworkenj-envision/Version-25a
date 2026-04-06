"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    try {
      const res = await fetch("/api/orders", { cache: "no-store" });
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error("Failed to load orders:", error);
    }
  }

  const totalOrders = orders.length;
  const revenue = orders.reduce((sum, order) => {
    return sum + Number(order.total || 0);
  }, 0);

  const paid = orders.filter(
    (order) => (order.status || "").toLowerCase() === "paid"
  ).length;

  const printing = orders.filter(
    (order) => (order.status || "").toLowerCase() === "printing"
  ).length;

  const shipped = orders.filter(
    (order) => (order.status || "").toLowerCase() === "shipped"
  ).length;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-[1500px]">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
            Admin Dashboard
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Overview of orders, revenue, and production status.
          </p>
        </div>

        <div className="mb-10 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          <Stat title="Total Orders" value={totalOrders} />
          <Stat title="Revenue" value={`$${revenue.toFixed(2)}`} />
          <Stat title="Paid" value={paid} />
          <Stat title="Printing" value={printing} />
          <Stat title="Shipped" value={shipped} />
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
          <h2 className="mb-2 text-xl font-semibold text-gray-900">
            Order Management
          </h2>

          <p className="mb-6 text-sm text-gray-500">
            View, update, and manage all customer orders.
          </p>

          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-2 rounded-xl bg-black px-6 py-3 text-sm font-medium text-white transition hover:opacity-90"
          >
            Go to Orders →
          </Link>
        </div>
      </div>
    </div>
  );
}

function Stat({ title, value }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="text-xs uppercase tracking-wide text-gray-400">
        {title}
      </div>
      <div className="mt-2 text-2xl font-semibold text-gray-900">
        {value}
      </div>
    </div>
  );
}