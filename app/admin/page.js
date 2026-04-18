"use client";

import Link from "next/link";

export default function AdminDashboard() {
  async function handleLogout() {
    await fetch("/api/admin/logout", {
      method: "POST",
    });

    window.location.href = "/admin/login";
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="mx-auto max-w-5xl space-y-6">
        
        {/* HEADER */}
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
                EnVision Direct
              </div>
              <h1 className="mt-3 text-3xl font-bold text-slate-900">
                Admin Dashboard
              </h1>
              <p className="mt-2 text-slate-600">
                Manage orders, pricing, and your storefront.
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="inline-flex items-center justify-center rounded-2xl bg-red-600 px-5 py-3 text-sm font-semibold text-white hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>

        {/* ADMIN ACTIONS */}
        <div className="grid gap-6 md:grid-cols-2">
          
          {/* ORDERS */}
          <Link
            href="/admin/orders"
            className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <h2 className="text-xl font-bold text-slate-900">
              Orders Dashboard
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              View and manage incoming print orders.
            </p>

            <div className="mt-4 text-sm font-semibold text-blue-600 group-hover:underline">
              Go to Orders →
            </div>
          </Link>

          {/* PRICING */}
          <Link
            href="/admin/pricing"
            className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <h2 className="text-xl font-bold text-slate-900">
              Pricing Admin
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Update pricing, quantities, and product configurations.
            </p>

            <div className="mt-4 text-sm font-semibold text-blue-600 group-hover:underline">
              Manage Pricing →
            </div>
          </Link>

        </div>
      </div>
    </main>
  );
}