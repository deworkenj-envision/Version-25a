"use client";

import { useEffect, useMemo, useState } from "react";
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

  const paidOrders = useMemo(() => {
    return orders.filter(
      (order) => (order.status || "").toLowerCase() === "paid"
    );
  }, [orders]);

  const printingOrders = useMemo(() => {
    return orders.filter(
      (order) => (order.status || "").toLowerCase() === "printing"
    );
  }, [orders]);

  const shippedOrders = useMemo(() => {
    return orders.filter(
      (order) => (order.status || "").toLowerCase() === "shipped"
    );
  }, [orders]);

  const newestPaidOrders = useMemo(() => {
    return [...paidOrders].sort((a, b) => {
      const aTime = a?.created_at ? new Date(a.created_at).getTime() : 0;
      const bTime = b?.created_at ? new Date(b.created_at).getTime() : 0;
      return bTime - aTime;
    });
  }, [paidOrders]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-[1600px]">
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
          <Stat title="Paid" value={paidOrders.length} />
          <Stat title="Printing" value={printingOrders.length} />
          <Stat title="Shipped" value={shippedOrders.length} />
        </div>

        <div className="mb-10 rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Order Management
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                View, update, and manage all customer orders.
              </p>
            </div>

            <Link
              href="/admin/orders"
              className="inline-flex items-center justify-center rounded-xl bg-black px-6 py-3 text-sm font-medium text-white transition hover:opacity-90"
            >
              Go to Orders →
            </Link>
          </div>
        </div>

        <div className="mb-4">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
            Production Pipeline
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Track where every order is in your print workflow.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <PipelineColumn
            title="New Orders"
            subtitle="Awaiting production start"
            badgeClass="bg-emerald-100 text-emerald-700"
            count={newestPaidOrders.length}
            orders={newestPaidOrders}
            emptyText="No new orders"
          />

          <PipelineColumn
            title="In Production"
            subtitle="Currently printing"
            badgeClass="bg-amber-100 text-amber-700"
            count={printingOrders.length}
            orders={printingOrders}
            emptyText="No active jobs"
          />

          <PipelineColumn
            title="Completed"
            subtitle="Shipped orders"
            badgeClass="bg-blue-100 text-blue-700"
            count={shippedOrders.length}
            orders={shippedOrders}
            emptyText="No completed orders"
          />
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

function PipelineColumn({
  title,
  subtitle,
  badgeClass,
  count,
  orders,
  emptyText,
}) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
        </div>

        <span
          className={`inline-flex min-w-[36px] items-center justify-center rounded-full px-3 py-1 text-xs font-semibold ${badgeClass}`}
        >
          {count}
        </span>
      </div>

      <div className="space-y-3">
        {orders.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-6 text-center text-sm text-gray-400">
            {emptyText}
          </div>
        ) : (
          orders.slice(0, 6).map((order) => (
            <PipelineCard key={order.id} order={order} />
          ))
        )}
      </div>

      {orders.length > 6 && (
        <div className="mt-4 text-xs text-gray-400">
          Showing 6 of {orders.length} orders in this stage.
        </div>
      )}
    </div>
  );
}

function PipelineCard({ order }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 transition hover:bg-white hover:shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="truncate text-base font-semibold text-gray-900">
            {order.order_number || "No order number"}
          </div>

          <div className="mt-1 truncate text-sm text-gray-700">
            {order.customer_name || "No customer"}
          </div>

          <div className="mt-1 truncate text-xs text-gray-500">
            {order.product_name || "Product not set"}
          </div>
        </div>

        <div className="shrink-0 text-sm font-semibold text-gray-900">
          ${Number(order.total || 0).toFixed(2)}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <div className="text-xs text-gray-400">
          Qty: {order.quantity || 0}
        </div>

        <Link
          href="/admin/orders"
          className="inline-flex items-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700 transition hover:border-gray-300 hover:bg-gray-100"
        >
          Open →
        </Link>
      </div>
    </div>
  );
}