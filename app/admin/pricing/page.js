"use client";

import { useEffect, useMemo, useState } from "react";

export default function AdminPricingPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [message, setMessage] = useState("");

  const [productFilter, setProductFilter] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadPricing();
  }, []);

  async function loadPricing() {
    try {
      setLoading(true);
      setMessage("");

      const res = await fetch("/api/pricing", { cache: "no-store" });
      const data = await res.json();

      if (!res.ok || !data?.success) {
        throw new Error(data?.error || "Failed to load pricing");
      }

      setRows(Array.isArray(data.pricing) ? data.pricing : []);
    } catch (err) {
      console.error(err);
      setMessage(err.message || "Failed to load pricing.");
    } finally {
      setLoading(false);
    }
  }

  async function updateRow(id, field, value) {
    try {
      setSavingId(id);
      setMessage("");

      const res = await fetch("/api/admin/update-pricing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, field, value }),
      });

      const data = await res.json();

      if (!res.ok || !data?.success) {
        throw new Error(data?.error || "Update failed");
      }

      setRows((prev) =>
        prev.map((row) =>
          row.id === id
            ? {
                ...row,
                [field]:
                  field === "price"
                    ? Number(value)
                    : field === "active"
                    ? Boolean(value)
                    : field === "sort_order"
                    ? Number(value)
                    : value,
              }
            : row
        )
      );

      setMessage("Pricing updated successfully.");
    } catch (err) {
      console.error(err);
      setMessage(err.message || "Update failed.");
    } finally {
      setSavingId(null);
    }
  }

  async function handleLogout() {
    try {
      await fetch("/api/admin/logout", {
        method: "POST",
      });
    } catch (err) {
      console.error(err);
    } finally {
      window.location.href = "/admin/login";
    }
  }

  const allProducts = useMemo(() => {
    return [
      "All",
      ...new Set(rows.map((row) => row.product_name).filter(Boolean)),
    ];
  }, [rows]);

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase();

    return rows.filter((row) => {
      const matchesProduct =
        productFilter === "All" || row.product_name === productFilter;

      const haystack = [
        row.product_name,
        row.size,
        row.paper,
        row.finish,
        row.sides,
        row.quantity,
        row.price,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = !query || haystack.includes(query);

      return matchesProduct && matchesSearch;
    });
  }, [rows, productFilter, search]);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 p-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
            <h1 className="text-3xl font-bold text-slate-900">
              Loading pricing...
            </h1>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
                EnVision Direct
              </div>
              <h1 className="mt-3 text-3xl font-bold text-slate-900">
                Pricing Admin
              </h1>
              <p className="mt-2 text-slate-600">
                Update live pricing used by your order page and checkout flow.
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

        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 md:p-8">
          <div className="grid gap-4 md:grid-cols-[240px_1fr]">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Filter by Product
              </label>
              <select
                value={productFilter}
                onChange={(e) => setProductFilter(e.target.value)}
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
              >
                {allProducts.map((product) => (
                  <option key={product} value={product}>
                    {product}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Search
              </label>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search size, paper, finish, sides, quantity..."
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
              />
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-3 text-sm text-slate-600">
            <div className="rounded-full bg-slate-100 px-4 py-2">
              Total Rows: <span className="font-semibold">{rows.length}</span>
            </div>
            <div className="rounded-full bg-slate-100 px-4 py-2">
              Showing:{" "}
              <span className="font-semibold">{filteredRows.length}</span>
            </div>
          </div>

          {message ? (
            <div className="mt-5 rounded-2xl bg-slate-100 p-4 text-sm text-slate-700">
              {message}
            </div>
          ) : null}
        </div>

        <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">
          <div className="overflow-x-auto">
            <table className="min-w-[1100px] w-full text-sm">
              <thead className="bg-slate-100 text-left text-slate-700">
                <tr>
                  <th className="p-4 font-semibold">Product</th>
                  <th className="p-4 font-semibold">Size</th>
                  <th className="p-4 font-semibold">Paper</th>
                  <th className="p-4 font-semibold">Finish</th>
                  <th className="p-4 font-semibold">Sides</th>
                  <th className="p-4 font-semibold">Qty</th>
                  <th className="p-4 font-semibold">Sort</th>
                  <th className="p-4 font-semibold">Price</th>
                  <th className="p-4 font-semibold">Active</th>
                  <th className="p-4 font-semibold">Status</th>
                </tr>
              </thead>

              <tbody>
                {filteredRows.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="p-8 text-center text-slate-500">
                      No pricing rows found.
                    </td>
                  </tr>
                ) : (
                  filteredRows.map((row) => (
                    <tr key={row.id} className="border-t border-slate-200">
                      <td className="p-4 font-medium text-slate-900">
                        {row.product_name}
                      </td>
                      <td className="p-4 text-slate-700">{row.size}</td>
                      <td className="p-4 text-slate-700">{row.paper}</td>
                      <td className="p-4 text-slate-700">{row.finish}</td>
                      <td className="p-4 text-slate-700">{row.sides}</td>
                      <td className="p-4 text-slate-700">{row.quantity}</td>

                      <td className="p-4">
                        <input
                          type="number"
                          value={row.sort_order ?? 0}
                          onChange={(e) =>
                            updateRow(row.id, "sort_order", e.target.value)
                          }
                          className="w-24 rounded-xl border border-slate-300 px-3 py-2 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                        />
                      </td>

                      <td className="p-4">
                        <input
                          type="number"
                          step="0.01"
                          value={row.price ?? 0}
                          onChange={(e) =>
                            updateRow(row.id, "price", e.target.value)
                          }
                          className="w-28 rounded-xl border border-slate-300 px-3 py-2 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                        />
                      </td>

                      <td className="p-4">
                        <label className="inline-flex cursor-pointer items-center gap-3">
                          <input
                            type="checkbox"
                            checked={Boolean(row.active)}
                            onChange={(e) =>
                              updateRow(row.id, "active", e.target.checked)
                            }
                            className="h-4 w-4 rounded border-slate-300"
                          />
                          <span className="text-slate-700">
                            {row.active ? "On" : "Off"}
                          </span>
                        </label>
                      </td>

                      <td className="p-4">
                        {savingId === row.id ? (
                          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                            Saving...
                          </span>
                        ) : (
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                            Ready
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}