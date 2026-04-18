"use client";

import { useEffect, useState } from "react";

export default function PricingPage() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    fetch("/api/pricing")
      .then((res) => res.json())
      .then((data) => setRows(data || []));
  }, []);

  const handleChange = (index, field, value) => {
    const updated = [...rows];
    updated[index][field] = value;
    setRows(updated);
  };

  const addRow = () => {
    setRows([
      ...rows,
      {
        product_name: "",
        size: "",
        paper: "",
        finish: "",
        sides: "",
        quantity: "",
        price: "",
      },
    ]);
  };

  const copyRow = (index) => {
    const newRow = { ...rows[index] };
    setRows([...rows.slice(0, index + 1), newRow, ...rows.slice(index + 1)]);
  };

  const deleteRow = (index) => {
    if (!confirm("Delete this row?")) return;
    setRows(rows.filter((_, i) => i !== index));
  };

  const saveAll = async () => {
    await fetch("/api/pricing", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(rows),
    });
    alert("Pricing saved");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Pricing Admin</h1>

      {/* ACTION BAR */}
      <div className="flex gap-4 mb-4">
        <button
          onClick={addRow}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Row
        </button>

        <button
          onClick={saveAll}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Save All
        </button>
      </div>

      {/* WIDE TABLE WRAPPER */}
      <div className="w-full overflow-x-auto border rounded">
        <table className="min-w-[1400px] w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              {[
                "Product",
                "Size",
                "Paper",
                "Finish",
                "Sides",
                "Qty",
                "Price",
                "Actions",
              ].map((col) => (
                <th
                  key={col}
                  className="p-3 text-left border whitespace-nowrap"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-t">
                {[
                  "product_name",
                  "size",
                  "paper",
                  "finish",
                  "sides",
                  "quantity",
                  "price",
                ].map((field) => (
                  <td key={field} className="p-2 border">
                    <input
                      value={row[field] || ""}
                      onChange={(e) =>
                        handleChange(i, field, e.target.value)
                      }
                      className="w-full min-w-[140px] border p-2 rounded"
                    />
                  </td>
                ))}

                {/* ACTIONS */}
                <td className="p-2 border whitespace-nowrap">
                  <div className="flex gap-2">
                    <button
                      onClick={() => copyRow(i)}
                      className="bg-blue-500 text-white px-2 py-1 rounded text-sm"
                    >
                      Copy
                    </button>

                    <button
                      onClick={() => deleteRow(i)}
                      className="bg-red-500 text-white px-2 py-1 rounded text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}