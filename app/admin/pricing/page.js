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

const presetOptions = {
  product_name: [
    "Business Cards",
    "Postcards",
    "Flyers",
    "Banners",
    "Brochures",
    "Door Hangers",
    "EDDM Postcards",
    "Rack Cards",
  ],
  size: [
    "2 x 3.5",
    "4 x 6",
    "4 x 5.5",
    "4.25 x 5.5",
    "4.25 x 6",
    "5 x 7",
    "5.5 x 8.5",
    "6 x 9",
    "8.5 x 11",
    "8.5 x 14",
    "11 x 17",
    "24 x 36",
    "36 x 48",
  ],
  paper: [
    "14pt C2S",
    "14pt Uncoated",
    "16pt C2S",
    "100lb Gloss Text",
    "100lb Matte Text",
    "100lb Gloss Cover",
    "100lb Matte Cover",
    "13oz Vinyl Banner",
  ],
  finish: [
    "No Coating",
    "Matte",
    "Gloss",
    "High Gloss UV",
    "AQ Coating",
    "High Gloss UV",
  ],
  sides: ["Front Only", "Front and Back"],
  quantity: [
    "100",
    "250",
    "500",
    "1000",
    "1500",
    "2000",
    "2500",
    "5000",
    "10000",
  ],
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

function profit(row) {
  return finalPrice(row) - Number(row.your_cost || 0);
}

function marginPercent(row) {
  const price = finalPrice(row);
  if (!price) return 0;
  return (profit(row) / price) * 100;
}

export default function AdminPricingPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [creating, setCreating] = useState(false);
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [downloadingTemplate, setDownloadingTemplate] = useState(false);
  const [message, setMessage] = useState("");

  const [productFilter, setProductFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [bulkMarkup, setBulkMarkup] = useState("");

  const [form, setForm] = useState(emptyForm);
  const [csvFile, setCsvFile] = useState(null);
  const [replaceExisting, setReplaceExisting] = useState(false);

  const createFormRef = useRef(null);
  const saveTimeout = useRef({});

  useEffect(() => {
    loadPricing();

    return () => {
      Object.values(saveTimeout.current).forEach((timer) =>
        clearTimeout(timer)
      );
    };
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

  function normalizeValue(field, value) {
    const numericFields = [
      "quantity",
      "your_cost",
      "markup_percent",
      "shipping_cost",
      "sort_order",
    ];

    if (field === "active") return Boolean(value);
    if (numericFields.includes(field)) return Number(value || 0);
    return value;
  }

  function getNextSortOrder(productName) {
    if (!productName) return "";

    const productRows = rows.filter((row) => row.product_name === productName);

    if (productRows.length === 0) return 1;

    const maxSort = Math.max(
      ...productRows.map((row) => Number(row.sort_order || 0))
    );

    return maxSort + 1;
  }

  function getDropdownOptions(field) {
    const preset = presetOptions[field] || [];
    const existing = rows
      .map((row) => row[field])
      .filter((value) => value !== null && value !== undefined && value !== "")
      .map((value) => String(value));

    return [...new Set([...preset, ...existing])];
  }

  function handleLocalChange(id, field, value) {
    const cleanValue = normalizeValue(field, value);

    setRows((prev) =>
      prev.map((row) =>
        row.id === id
          ? {
              ...row,
              [field]: cleanValue,
            }
          : row
      )
    );

    const delayedSaveFields = [
      "sort_order",
      "your_cost",
      "markup_percent",
      "shipping_cost",
    ];

    if (delayedSaveFields.includes(field)) {
      scheduleAutoSave(id, field, cleanValue);
    } else {
      updateRow(id, field, cleanValue);
    }
  }

  function scheduleAutoSave(id, field, value) {
    const key = `${id}-${field}`;

    clearTimeout(saveTimeout.current[key]);

    saveTimeout.current[key] = setTimeout(() => {
      updateRow(id, field, value);
    }, 2000);
  }

  async function updateRow(id, field, value) {
    try {
      setMessage("");

      const cleanValue = normalizeValue(field, value);

      const res = await fetch("/api/admin/update-pricing", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, field, value: cleanValue }),
      });

      const data = await res.json();

      if (!res.ok || !data?.success) {
        throw new Error(data?.error || `Update failed with status ${res.status}`);
      }
    } catch (err) {
      console.error("PRICING SAVE ERROR:", err);
      setMessage(`Save failed: ${err.message}`);
    }
  }

  // ✅ UPDATED BULK CSV SECTION BELOW
  // (everything else unchanged)

  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-8">
      <div className="w-full px-4 space-y-6">

        {/* BULK CSV IMPORT - UPDATED */}
        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200 md:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Bulk CSV Import</h2>
              <p className="mt-1 text-slate-600">
                Upload a CSV to import many pricing rows at once.
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Required columns: product_name, size, paper, finish, sides, quantity,
                your_cost, markup_percent, shipping_cost, sort_order, active
              </p>
            </div>

            <div className="flex flex-col gap-3 lg:min-w-[560px]">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
                <input
                  type="file"
                  accept=".csv,text/csv"
                  onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
                  className="block text-sm text-slate-700 file:mr-4 file:rounded-full file:border-0 file:bg-blue-700 file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-white hover:file:bg-blue-800"
                />

                <button
                  type="button"
                  onClick={handleImportCsv}
                  disabled={importing || !csvFile}
                  className="rounded-2xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:opacity-60"
                >
                  {importing ? "Importing..." : "Import CSV"}
                </button>
              </div>

              <label className="inline-flex items-center gap-3 self-start rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 lg:self-end">
                <input
                  type="checkbox"
                  checked={replaceExisting}
                  onChange={(e) => setReplaceExisting(e.target.checked)}
                  className="h-4 w-4"
                />
                <span className="text-sm font-medium text-amber-900">
                  Replace all existing pricing rows with this CSV
                </span>
              </label>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}