"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const emptyForm = {
  product_name: "",
  size: "",
  paper: "",
  finish: "",
  sides: "",
  quantity: "",
  your_cost: "",
  markup_percent: "",
  shipping_cost: "",
  sort_order: "",
  active: true,
};

function money(value) {
  const num = Number(value || 0);
  return `$${num.toFixed(2)}`;
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
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadPricing();
  }, []);

  async function loadPricing() {
    try {
      const res = await fetch("/api/pricing", { cache: "no-store" });
      const data = await res.json();
      setRows(data.pricing || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function updateRow(id, field, value) {
    const numericFields = ["your_cost", "markup_percent", "shipping_cost"];

    const cleanValue = numericFields.includes(field)
      ? Number(value || 0)
      : value;

    await fetch("/api/admin/update-pricing", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, field, value: cleanValue }),
    });

    setRows((prev) =>
      prev.map((row) =>
        row.id === id ? { ...row, [field]: cleanValue } : row
      )
    );
  }

  if (loading) return <div>Loading...</div>;

  return (
    <main className="p-6">
      <table className="w-full text-sm">
        <thead>
          <tr>
            <th>Product</th>
            <th>Cost</th>
            <th>Markup %</th>
            <th>Shipping</th>
            <th>Final Price</th>
            <th>Total</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td>{row.product_name}</td>

              {/* ✅ FIXED: Controlled input */}
              <td>
                <input
                  type="number"
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
                />
              </td>

              {/* ✅ FIXED */}
              <td>
                <input
                  type="number"
                  value={row.markup_percent ?? ""}
                  onChange={(e) =>
                    setRows((prev) =>
                      prev.map((item) =>
                        item.id === row.id
                          ? { ...item, markup_percent: e.target.value }
                          : item
                      )
                    )
                  }
                  onBlur={(e) =>
                    updateRow(row.id, "markup_percent", e.target.value)
                  }
                />
              </td>

              {/* ✅ FIXED */}
              <td>
                <input
                  type="number"
                  value={row.shipping_cost ?? ""}
                  onChange={(e) =>
                    setRows((prev) =>
                      prev.map((item) =>
                        item.id === row.id
                          ? { ...item, shipping_cost: e.target.value }
                          : item
                      )
                    )
                  }
                  onBlur={(e) =>
                    updateRow(row.id, "shipping_cost", e.target.value)
                  }
                />
              </td>

              {/* Auto updates instantly now */}
              <td>{money(finalPrice(row))}</td>
              <td>{money(totalWithShipping(row))}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}