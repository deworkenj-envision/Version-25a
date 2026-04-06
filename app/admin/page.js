"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [updatingId, setUpdatingId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

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

  async function updateOrderStatus(orderId, newStatus) {
    try {
      setUpdatingId(orderId);

      const currentOrder = orders.find((order) => order.id === orderId);

      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        throw new Error("Failed to update order status");
      }

      const data = await res.json();
      const updatedOrder = data?.order;

      await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: currentOrder?.customer_email,
          name: currentOrder?.customer_name,
          orderNumber: currentOrder?.order_number,
          status: newStatus,
        }),
      });

      if (updatedOrder?.id) {
        setOrders((prev) =>
          prev.map((order) =>
            order.id === updatedOrder.id ? { ...order, ...updatedOrder } : order
          )
        );

        if (selectedOrder?.id === updatedOrder.id) {
          setSelectedOrder((prev) => ({ ...prev, ...updatedOrder }));
        }
      } else {
        await loadOrders();
      }
    } catch (error) {
      console.error("Status update failed:", error);
    } finally {
      setUpdatingId(null);
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

  const averageOrderValue = totalOrders > 0 ? revenue / totalOrders : 0;

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

        <div className="mb-10 grid grid-cols-1 gap-5 lg:grid-cols-2">
          <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
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

          <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">
              Order Insights
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Quick financial and workflow summary.
            </p>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <MiniStat
                label="Average Order Value"
                value={`$${averageOrderValue.toFixed(2)}`}
              />
              <MiniStat
                label="Open Production Jobs"
                value={printingOrders.length}
              />
              <MiniStat
                label="New Orders Waiting"
                value={newestPaidOrders.length}
              />
              <MiniStat
                label="Completed Orders"
                value={shippedOrders.length}
              />
            </div>
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
            updatingId={updatingId}
            onUpdateStatus={updateOrderStatus}
            onOpenDetails={setSelectedOrder}
          />

          <PipelineColumn
            title="In Production"
            subtitle="Currently printing"
            badgeClass="bg-amber-100 text-amber-700"
            count={printingOrders.length}
            orders={printingOrders}
            emptyText="No active jobs"
            updatingId={updatingId}
            onUpdateStatus={updateOrderStatus}
            onOpenDetails={setSelectedOrder}
          />

          <PipelineColumn
            title="Completed"
            subtitle="Shipped orders"
            badgeClass="bg-blue-100 text-blue-700"
            count={shippedOrders.length}
            orders={shippedOrders}
            emptyText="No completed orders"
            updatingId={updatingId}
            onUpdateStatus={updateOrderStatus}
            onOpenDetails={setSelectedOrder}
          />
        </div>
      </div>

      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onUpdateStatus={updateOrderStatus}
          isUpdating={updatingId === selectedOrder.id}
        />
      )}
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

function MiniStat({ label, value }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
      <div className="text-xs uppercase tracking-wide text-gray-400">
        {label}
      </div>
      <div className="mt-2 text-lg font-semibold text-gray-900">{value}</div>
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
  updatingId,
  onUpdateStatus,
  onOpenDetails,
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
            <PipelineCard
              key={order.id}
              order={order}
              isUpdating={updatingId === order.id}
              onUpdateStatus={onUpdateStatus}
              onOpenDetails={onOpenDetails}
            />
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

function PipelineCard({ order, isUpdating, onUpdateStatus, onOpenDetails }) {
  const status = (order.status || "").toLowerCase();

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

        <div className="flex items-center gap-2">
          {status === "paid" && (
            <button
              type="button"
              onClick={() => onUpdateStatus(order.id, "printing")}
              disabled={isUpdating}
              className="rounded-lg bg-amber-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isUpdating ? "Updating..." : "Start Printing"}
            </button>
          )}

          {status === "printing" && (
            <button
              type="button"
              onClick={() => onUpdateStatus(order.id, "shipped")}
              disabled={isUpdating}
              className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isUpdating ? "Updating..." : "Mark Shipped"}
            </button>
          )}

          <button
            type="button"
            onClick={() => onOpenDetails(order)}
            className="inline-flex items-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700 transition hover:border-gray-300 hover:bg-gray-100"
          >
            Details
          </button>
        </div>
      </div>
    </div>
  );
}

function OrderDetailsModal({ order, onClose, onUpdateStatus, isUpdating }) {
  const status = (order.status || "").toLowerCase();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-gray-100 p-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              {order.order_number || "Order Details"}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Review customer, product, and production details.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Close
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
          <DetailBlock title="Customer">
            <DetailRow label="Name" value={order.customer_name || "—"} />
            <DetailRow label="Email" value={order.customer_email || "—"} />
          </DetailBlock>

          <DetailBlock title="Order">
            <DetailRow label="Status" value={order.status || "—"} />
            <DetailRow
              label="Created"
              value={
                order.created_at
                  ? new Date(order.created_at).toLocaleString()
                  : "—"
              }
            />
          </DetailBlock>

          <DetailBlock title="Product">
            <DetailRow label="Product" value={order.product_name || "—"} />
            <DetailRow label="Quantity" value={order.quantity || "—"} />
            <DetailRow label="Size" value={order.size || "—"} />
            <DetailRow label="Paper" value={order.paper || "—"} />
            <DetailRow label="Finish" value={order.finish || "—"} />
            <DetailRow label="Sides" value={order.sides || "—"} />
          </DetailBlock>

          <DetailBlock title="Pricing">
            <DetailRow
              label="Subtotal"
              value={`$${Number(order.subtotal || 0).toFixed(2)}`}
            />
            <DetailRow
              label="Shipping"
              value={`$${Number(order.shipping || 0).toFixed(2)}`}
            />
            <DetailRow
              label="Total"
              value={`$${Number(order.total || 0).toFixed(2)}`}
              strong
            />
          </DetailBlock>

          <DetailBlock title="Artwork & Notes" className="md:col-span-2">
            <DetailRow label="File Name" value={order.file_name || "—"} />
            <DetailRow label="Notes" value={order.notes || "—"} />
            {order.artwork_url ? (
              <div className="mt-4">
                <a
                  href={order.artwork_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center rounded-xl bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700"
                >
                  Download Artwork
                </a>
              </div>
            ) : (
              <div className="mt-4 text-sm text-gray-400">
                No artwork uploaded.
              </div>
            )}
          </DetailBlock>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 p-6">
          <div className="flex flex-wrap items-center gap-3">
            {status === "paid" && (
              <button
                type="button"
                onClick={() => onUpdateStatus(order.id, "printing")}
                disabled={isUpdating}
                className="rounded-xl bg-amber-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isUpdating ? "Updating..." : "Start Printing"}
              </button>
            )}

            {status === "printing" && (
              <button
                type="button"
                onClick={() => onUpdateStatus(order.id, "shipped")}
                disabled={isUpdating}
                className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isUpdating ? "Updating..." : "Mark Shipped"}
              </button>
            )}

            <Link
              href="/admin/orders"
              className="inline-flex items-center rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Open Full Orders Page
            </Link>
          </div>

          <div className="text-sm text-gray-400">
            Stripe Session: {order.stripe_session_id || "—"}
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailBlock({ title, children, className = "" }) {
  return (
    <div className={`rounded-2xl border border-gray-100 bg-gray-50 p-5 ${className}`}>
      <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
        {title}
      </h3>
      <div className="mt-4 space-y-3">{children}</div>
    </div>
  );
}

function DetailRow({ label, value, strong = false }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-gray-100 pb-2 last:border-b-0 last:pb-0">
      <div className="shrink-0 text-sm text-gray-500">{label}</div>
      <div
        className={`text-right text-sm ${
          strong ? "font-semibold text-gray-900" : "text-gray-800"
        }`}
      >
        {value}
      </div>
    </div>
  );
}