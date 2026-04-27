"use client";

import { useEffect, useMemo, useState } from "react";

function money(value) {
  return `$${Number(value || 0).toFixed(2)}`;
}

function finalPrice(row) {
  const cost = Number(row.your_cost || 0);
  const markup = Number(row.markup_percent || 0);
  return cost * (1 + markup / 100);
}

function totalWithShipping(row) {
  return finalPrice(row) + Number(row.shipping_cost || 0);
}

export default function AdminPricingPage() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    fetch("/api/pricing")
      .then((res) => res.json())
      .then((data) => setRows(data.pricing || []));
  }, []);

  async function updateRow(id, field, value) {
    await fetch("/api/admin/update-pricing", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
        field,
        value: Number(value || 0),
      }),
    });
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">

        <div className="bg-white rounded-3xl p-6 shadow-sm ring-1 ring-slate-200">
          <h1 className="text-3xl font-bold text-slate-900">
            Pricing Admin
          </h1>
          <p className="text-slate-600 mt-2">
            Live pricing editor with automatic calculations
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm ring-1 ring-slate-200 overflow-x-auto">
          <table className="w-full text-sm min-w-[900px]">
            <thead className="bg-slate-100 text-slate-700">
              <tr>
                <th className="px-4 py-3 text-left">Product</th>
                <th className="px-4 py-3">Cost</th>
                <th className="px-4 py-3">Markup %</th>
                <th className="px-4 py-3">Shipping</th>
                <th className="px-4 py-3">Final Price</th>
                <th className="px-4 py-3">Total</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-t">
                  <td className="px-4 py-3 font-medium text-slate-900">
                    {row.product_name}
                  </td>

                  {/* COST */}
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      step="0.01"
                      value={row.your_cost ?? ""}
                      onChange={(e) =>
                        setRows((prev) =>
                          prev.map((item) =>
                            item.id === row.id
                              ? { ...item, your_cost: e.target.value }
                              : item
                          )
                        )
                      }
                      onBlur={(e) =>
                        updateRow(row.id, "your_cost", e.target.value)
                      }
                      className="w-24 rounded-xl border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </td>

                  {/* MARKUP */}
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      step="0.01"
                      value={row.markup_percent ?? ""}
                      onChange={(e) =>
                        setRows((prev) =>
                          prev.map((item) =>
                            item.id === row.id
                              ? {
                                  ...item,
                                  markup_percent: e.target.value,
                                }
                              : item
                          )
                        )
                      }
                      onBlur={(e) =>
                        updateRow(row.id, "markup_percent", e.target.value)
                      }
                      className="w-20 rounded-xl border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </td>

                  {/* SHIPPING */}
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      step="0.01"
                      value={row.shipping_cost ?? ""}
                      onChange={(e) =>
                        setRows((prev) =>
                          prev.map((item) =>
                            item.id === row.id
                              ? {
                                  ...item,
                                  shipping_cost: e.target.value,
                                }
                              : item
                          )
                        )
                      }
                      onBlur={(e) =>
                        updateRow(row.id, "shipping_cost", e.target.value)
                      }
                      className="w-24 rounded-xl border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </td>

                  {/* FINAL PRICE */}
                  <td className="px-4 py-3 font-semibold text-slate-900">
                    {money(finalPrice(row))}
                  </td>

                  {/* TOTAL */}
                  <td className="px-4 py-3 font-bold text-emerald-600">
                    {money(totalWithShipping(row))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}