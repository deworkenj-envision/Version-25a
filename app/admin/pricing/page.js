"use client";

import { useEffect, useState } from "react";

export default function AdminPricingPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);

  useEffect(() => {
    loadPricing();
  }, []);

  async function loadPricing() {
    try {
      setLoading(true);

      const res = await fetch("/api/pricing");
      const data = await res.json();

      if (!data.success) throw new Error("Failed to load pricing");

      setRows(data.pricing || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function updateRow(id, field, value) {
    try {
      setSavingId(id);

      const res = await fetch("/api/admin/update-pricing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, field, value }),
      });

      const data = await res.json();

      if (!data.success) throw new Error("Update failed");

      setRows((prev) =>
        prev.map((row) =>
          row.id === id ? { ...row, [field]: value } : row
        )
      );
    } catch (err) {
      console.error(err);
      alert("Update failed");
    } finally {
      setSavingId(null);
    }
  }

  if (loading) {
    return (
      <div className="p-10 text-xl font-semibold">Loading pricing...</div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <h1 className="mb-6 text-3xl font-bold">Pricing Admin</h1>

      <div className="overflow-auto rounded-xl bg-white shadow">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 text-left">
            <tr>
              <th className="p-3">Product</th>
              <th className="p-3">Size</th>
              <th className="p-3">Paper</th>
              <th className="p-3">Finish</th>
              <th className="p-3">Sides</th>
              <th className="p-3">Qty</th>
              <th className="p-3">Price</th>
              <th className="p-3">Active</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-t">
                <td className="p-3">{row.product_name}</td>
                <td className="p-3">{row.size}</td>
                <td className="p-3">{row.paper}</td>
                <td className="p-3">{row.finish}</td>
                <td className="p-3">{row.sides}</td>
                <td className="p-3">{row.quantity}</td>

                {/* EDIT PRICE */}
                <td className="p-3">
                  <input
                    type="number"
                    value={row.price}
                    onChange={(e) =>
                      updateRow(row.id, "price", e.target.value)
                    }
                    className="w-24 rounded border p-2"
                  />
                </td>

                {/* ACTIVE TOGGLE */}
                <td className="p-3">
                  <input
                    type="checkbox"
                    checked={row.active}
                    onChange={(e) =>
                      updateRow(row.id, "active", e.target.checked)
                    }
                  />
                </td>

                {savingId === row.id && (
                  <td className="p-3 text-xs text-blue-600">
                    Saving...
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}