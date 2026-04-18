"use client";

import Link from "next/link";

export default function AdminDashboard() {
  async function handleLogout() {
    try {
      await fetch("/api/admin/logout", {
        method: "POST",
      });
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      window.location.href = "/admin/login";
    }
  }

  const adminLinks = [
    {
      title: "Orders Dashboard",
      description:
        "View incoming orders, update statuses, and manage production workflow.",
      href: "/admin/orders",
      cta: "Go to Orders →",
    },
    {
      title: "Pricing Admin",
      description:
        "Update live pricing, quantities, active products, and sorting for your estimator.",
      href: "/admin/pricing",
      cta: "Manage Pricing →",
    },
    {
      title: "Tracking / Shipping",
      description:
        "Enter carrier and tracking details for customer orders and shipping updates.",
      href: "/admin/track",
      cta: "Manage Tracking →",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
                EnVision Direct
              </div>
              <h1 className="mt-3 text-3xl font-bold text-slate-900 md:text-4xl">
                Admin Dashboard
              </h1>
              <p className="mt-2 max-w-2xl text-slate-600">
                Manage orders, pricing, and shipping from one central dashboard.
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="inline-flex items-center justify-center rounded-2xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {adminLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <h2 className="text-xl font-bold text-slate-900">
                {item.title}
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                {item.description}
              </p>

              <div className="mt-5 text-sm font-semibold text-blue-600 group-hover:underline">
                {item.cta}
              </div>
            </Link>
          ))}
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 md:p-8">
          <h2 className="text-xl font-bold text-slate-900">Quick Admin Notes</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="text-sm font-semibold text-slate-900">
                Orders Dashboard
              </div>
              <div className="mt-1 text-sm text-slate-600">
                Best place for daily order updates and production status changes.
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="text-sm font-semibold text-slate-900">
                Pricing Admin
              </div>
              <div className="mt-1 text-sm text-slate-600">
                Controls the live pricing used by your order estimator and checkout.
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="text-sm font-semibold text-slate-900">
                Tracking / Shipping
              </div>
              <div className="mt-1 text-sm text-slate-600">
                Use this when your vendor gives you tracking details to enter.
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}