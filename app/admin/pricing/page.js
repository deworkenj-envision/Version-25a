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
    "UV Coating",
    "AQ Coating",
    "High Gloss UV",
  ],
  sides: ["Front Only", "Front and Back"],
  quantity: ["100", "250", "500", "1000", "2500", "5000", "10000"],
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
  const [savingId, setSavingId] = useState(null);
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

  function uniqueValues(values) {
    return [
      ...new Set(
        values
          .filter((value) => value !== null && value !== undefined && value !== "")
          .map((value) => String(value))
      ),
    ];
  }

  function getDropdownOptions(field) {
    const preset = presetOptions[field] || [];
    const existing = rows.map((row) => row[field]);

    return uniqueValues([...preset, ...existing]);
  }

  function getDependentDropdownOptions(field, source) {
    if (field === "product_name") {
      return getDropdownOptions("product_name");
    }

    let matchingRows = rows;

    if (source.product_name) {
      matchingRows = matchingRows.filter(
        (row) => row.product_name === source.product_name
      );
    }

    if (field !== "size" && source.size) {
      matchingRows = matchingRows.filter((row) => String(row.size) === String(source.size));
    }

    if (!["size", "paper"].includes(field) && source.paper) {
      matchingRows = matchingRows.filter((row) => row.paper === source.paper);
    }

    if (!["size", "paper", "finish"].includes(field) && source.finish) {
      matchingRows = matchingRows.filter((row) => row.finish === source.finish);
    }

    if (!["size", "paper", "finish", "sides"].includes(field) && source.sides) {
      matchingRows = matchingRows.filter((row) => row.sides === source.sides);
    }

    const matchingOptions = uniqueValues(matchingRows.map((row) => row[field]));
    const fallbackOptions = getDropdownOptions(field);
    const currentValue =
      source[field] !== null && source[field] !== undefined && source[field] !== ""
        ? [String(source[field])]
        : [];

    return uniqueValues([
      ...currentValue,
      ...(matchingOptions.length ? matchingOptions : fallbackOptions),
    ]);
  }

  function handleFormChange(field, value) {
    setForm((prev) => {
      const next = { ...prev, [field]: value };

      if (field === "product_name") {
        next.size = "";
        next.paper = "";
        next.finish = "";
        next.sides = "";
        next.quantity = "";
      }

      if (field === "size") {
        next.paper = "";
        next.finish = "";
        next.sides = "";
        next.quantity = "";
      }

      if (field === "paper") {
        next.finish = "";
        next.sides = "";
        next.quantity = "";
      }

      if (field === "finish") {
        next.sides = "";
        next.quantity = "";
      }

      if (field === "sides") {
        next.quantity = "";
      }

      return next;
    });
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

    scheduleAutoSave(id, field, cleanValue);
  }

  function scheduleAutoSave(id, field, value) {
    const key = `${id}-${field}`;

    clearTimeout(saveTimeout.current[key]);

    saveTimeout.current[key] = setTimeout(() => {
      updateRow(id, field, value);
    }, 800);
  }

  async function updateRow(id, field, value) {
    try {
      setSavingId(id);
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
    } catch (err) {
      console.error("PRICING SAVE ERROR:", err);
      setMessage(`Save failed: ${err.message}`);
    } finally {
      setSavingId(null);
    }
  }

  async function handleApplyBulkMarkup() {
    const value = Number(bulkMarkup);

    if (bulkMarkup === "" || Number.isNaN(value)) {
      setMessage("Enter a valid markup percentage first.");
      return;
    }

    const confirmed = window.confirm(
      `Apply ${value}% markup to ALL pricing rows?`
    );

    if (!confirmed) return;

    try {
      setMessage("Applying bulk markup...");

      setRows((prev) =>
        prev.map((row) => ({
          ...row,
          markup_percent: value,
        }))
      );

      await Promise.all(
        rows.map((row) => updateRow(row.id, "markup_percent", value))
      );

      setMessage(`Bulk markup updated to ${value}% for all rows.`);
    } catch (err) {
      console.error(err);
      setMessage(err.message || "Bulk markup update failed.");
    }
  }

  async function handleCreateRow(e) {
    e.preventDefault();

    try {
      setCreating(true);
      setMessage("");

      const payload = {
        product_name: form.product_name.trim(),
        size: form.size.trim(),
        paper: form.paper.trim(),
        finish: form.finish.trim(),
        sides: form.sides.trim(),
        quantity: Number(form.quantity),
        your_cost: Number(form.your_cost),
        markup_percent: Number(form.markup_percent),
        shipping_cost: Number(form.shipping_cost),
        sort_order: form.sort_order === "" ? 0 : Number(form.sort_order),
        active: Boolean(form.active),
      };

      if (
        !payload.product_name ||
        !payload.size ||
        !payload.paper ||
        !payload.finish ||
        !payload.sides ||
        !payload.quantity ||
        Number.isNaN(payload.quantity) ||
        Number.isNaN(payload.your_cost) ||
        Number.isNaN(payload.markup_percent) ||
        Number.isNaN(payload.shipping_cost)
      ) {
        throw new Error("Please complete all required pricing row fields.");
      }

      const res = await fetch("/api/admin/create-pricing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data?.success) {
        throw new Error(data?.error || "Failed to create pricing row.");
      }

      setForm(emptyForm);
      setMessage("New pricing row created successfully.");
      await loadPricing();
    } catch (err) {
      console.error(err);
      setMessage(err.message || "Failed to create pricing row.");
    } finally {
      setCreating(false);
    }
  }

  async function handleImportCsv() {
    if (!csvFile) {
      setMessage("Please choose a CSV file first.");
      return;
    }

    try {
      setImporting(true);
      setMessage("");

      const text = await csvFile.text();

      if (replaceExisting) {
        const confirmed = window.confirm(
          "Replace all existing pricing rows with this CSV?\n\nThis will delete all current pricing rows first."
        );

        if (!confirmed) {
          setImporting(false);
          return;
        }
      }

      const res = await fetch("/api/admin/import-pricing-csv", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          csvText: text,
          replaceExisting,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data?.success) {
        throw new Error(data?.error || "CSV import failed.");
      }

      setCsvFile(null);
      setMessage(
        replaceExisting
          ? `CSV replace import complete. Replaced pricing with ${data.insertedCount} row(s).`
          : `CSV import complete. Imported ${data.insertedCount} row(s).`
      );
      await loadPricing();
    } catch (err) {
      console.error(err);
      setMessage(err.message || "CSV import failed.");
    } finally {
      setImporting(false);
    }
  }

  async function handleExportCsv() {
    try {
      setExporting(true);
      setMessage("");

      const res = await fetch("/api/admin/export-pricing-csv", {
        method: "GET",
        cache: "no-store",
      });

      if (!res.ok) {
        let errorMessage = "CSV export failed.";
        try {
          const data = await res.json();
          errorMessage = data?.error || errorMessage;
        } catch {}
        throw new Error(errorMessage);
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "pricing-export.csv";
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
      setMessage("Pricing CSV exported successfully.");
    } catch (err) {
      console.error(err);
      setMessage(err.message || "CSV export failed.");
    } finally {
      setExporting(false);
    }
  }

  async function handleDownloadTemplate() {
    try {
      setDownloadingTemplate(true);
      setMessage("");

      const res = await fetch("/api/admin/pricing-template-csv", {
        method: "GET",
        cache: "no-store",
      });

      if (!res.ok) {
        let errorMessage = "Template download failed.";
        try {
          const data = await res.json();
          errorMessage = data?.error || errorMessage;
        } catch {}
        throw new Error(errorMessage);
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "pricing-template.csv";
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
      setMessage("Pricing CSV template downloaded.");
    } catch (err) {
      console.error(err);
      setMessage(err.message || "Template download failed.");
    } finally {
      setDownloadingTemplate(false);
    }
  }

  function handleCopyRow(row) {
    setForm({
      product_name: row.product_name || "",
      size: row.size || "",
      paper: row.paper || "",
      finish: row.finish || "",
      sides: row.sides || "",
      quantity: row.quantity ? String(row.quantity) : "",
      your_cost:
        row.your_cost !== null && row.your_cost !== undefined
          ? String(row.your_cost)
          : "",
      markup_percent:
        row.markup_percent !== null && row.markup_percent !== undefined
          ? String(row.markup_percent)
          : "",
      shipping_cost:
        row.shipping_cost !== null && row.shipping_cost !== undefined
          ? String(row.shipping_cost)
          : "",
      sort_order:
        row.sort_order !== null && row.sort_order !== undefined
          ? String(row.sort_order)
          : "",
      active: Boolean(row.active),
    });

    setMessage(
      `Copied row for ${row.product_name}. Update quantity, cost, markup, or shipping, then click Add New Pricing Row.`
    );

    if (createFormRef.current) {
      createFormRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }

  async function handleDeleteRow(row) {
    const label = [
      row.product_name,
      row.size,
      row.paper,
      row.finish,
      row.sides,
      `Qty ${row.quantity}`,
    ]
      .filter(Boolean)
      .join(" • ");

    const confirmed = window.confirm(
      `Delete this pricing row?\n\n${label}\n\nThis cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setDeletingId(row.id);
      setMessage("");

      const res = await fetch("/api/admin/delete-pricing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: row.id }),
      });

      const data = await res.json();

      if (!res.ok || !data?.success) {
        throw new Error(data?.error || "Failed to delete pricing row.");
      }

      setRows((prev) => prev.filter((item) => item.id !== row.id));
      setMessage("Pricing row deleted successfully.");
    } catch (err) {
      console.error(err);
      setMessage(err.message || "Failed to delete pricing row.");
    } finally {
      setDeletingId(null);
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
        row.your_cost,
        row.markup_percent,
        row.shipping_cost,
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
      <div className="w-full px-4 space-y-6">
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
                Update product-specific pricing, markup, shipping, and live order options.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleDownloadTemplate}
                disabled={downloadingTemplate}
                className="inline-flex items-center justify-center rounded-2xl bg-slate-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
              >
                {downloadingTemplate ? "Downloading..." : "Download Template"}
              </button>

              <button
                onClick={handleExportCsv}
                disabled={exporting}
                className="inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
              >
                {exporting ? "Exporting..." : "Export CSV"}
              </button>

              <button
                onClick={handleLogout}
                className="inline-flex items-center justify-center rounded-2xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 md:p-8">
          <h2 className="text-2xl font-bold text-slate-900">Bulk CSV Import</h2>
          <p className="mt-2 text-slate-600">
            Upload a CSV to import many pricing rows at once.
          </p>
          <p className="mt-2 text-sm text-slate-500">
            Required columns: product_name, size, paper, finish, sides, quantity,
            your_cost, markup_percent, shipping_cost, sort_order, active
          </p>

          <div className="mt-5 flex flex-col gap-3 md:flex-row md:items-center">
            <input
              type="file"
              accept=".csv,text/csv"
              onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
              className="block w-full text-sm text-slate-700 file:mr-4 file:rounded-full file:border-0 file:bg-blue-700 file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-white hover:file:bg-blue-800"
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

          <label className="mt-4 inline-flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
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

        <div
          ref={createFormRef}
          className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 md:p-8"
        >
          <h2 className="text-2xl font-bold text-slate-900">
            Add New Pricing Row
          </h2>
          <p className="mt-2 text-slate-600">
            Add a new product combination to your live estimator.
          </p>

          <form
            onSubmit={handleCreateRow}
            className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4"
          >
            <select
              value={form.product_name}
              onChange={(e) => handleFormChange("product_name", e.target.value)}
              className="rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
            >
              <option value="">Product Name</option>
              {getDependentDropdownOptions("product_name", form).map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>

            <select
              value={form.size}
              onChange={(e) => handleFormChange("size", e.target.value)}
              className="rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
            >
              <option value="">Size</option>
              {getDependentDropdownOptions("size", form).map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>

            <select
              value={form.paper}
              onChange={(e) => handleFormChange("paper", e.target.value)}
              className="rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
            >
              <option value="">Paper</option>
              {getDependentDropdownOptions("paper", form).map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>

            <select
              value={form.finish}
              onChange={(e) => handleFormChange("finish", e.target.value)}
              className="rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
            >
              <option value="">Finish</option>
              {getDependentDropdownOptions("finish", form).map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>

            <select
              value={form.sides}
              onChange={(e) => handleFormChange("sides", e.target.value)}
              className="rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
            >
              <option value="">Sides</option>
              {getDependentDropdownOptions("sides", form).map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>

            <select
              value={form.quantity}
              onChange={(e) => handleFormChange("quantity", e.target.value)}
              className="rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
            >
              <option value="">Quantity</option>
              {getDependentDropdownOptions("quantity", form).map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>

            <input
              type="number"
              step="0.01"
              placeholder="Your Cost"
              value={form.your_cost}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, your_cost: e.target.value }))
              }
              className="rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
            />

            <input
              type="number"
              step="0.01"
              placeholder="Markup %"
              value={form.markup_percent}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, markup_percent: e.target.value }))
              }
              className="rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
            />

            <input
              type="number"
              step="0.01"
              placeholder="Shipping Cost"
              value={form.shipping_cost}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, shipping_cost: e.target.value }))
              }
              className="rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
            />

            <input
              type="number"
              placeholder="Sort Order"
              value={form.sort_order}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, sort_order: e.target.value }))
              }
              className="rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
            />

            <div className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3">
              <div className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                Final Price Preview
              </div>
              <div className="mt-1 text-lg font-bold text-slate-900">
                {money(finalPrice(form))}
              </div>
              <div className="text-xs text-slate-500">
                Total with shipping: {money(totalWithShipping(form))}
              </div>
            </div>

            <label className="flex items-center gap-3 rounded-2xl border border-slate-300 px-4 py-3">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, active: e.target.checked }))
                }
                className="h-4 w-4"
              />
              <span className="text-sm font-medium text-slate-700">Active</span>
            </label>

            <div className="xl:col-span-4">
              <button
                type="submit"
                disabled={creating}
                className="w-full rounded-2xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:opacity-60"
              >
                {creating ? "Adding Row..." : "Add New Pricing Row"}
              </button>
            </div>
          </form>

          {message ? (
            <div className="mt-5 rounded-2xl bg-slate-100 p-4 text-sm text-slate-700">
              {message}
            </div>
          ) : null}
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
                placeholder="Search product, size, paper, finish, sides, quantity..."
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
              />
            </div>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-[220px_auto_1fr] md:items-end">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Bulk Markup %
              </label>
              <input
                type="number"
                step="0.01"
                value={bulkMarkup}
                onChange={(e) => setBulkMarkup(e.target.value)}
                placeholder="Example: 50"
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <button
              type="button"
              onClick={handleApplyBulkMarkup}
              className="rounded-2xl bg-indigo-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-800"
            >
              Apply to All Rows
            </button>

            <div className="flex flex-wrap gap-3 text-sm text-slate-600">
              <div className="rounded-full bg-slate-100 px-4 py-2">
                Total Rows: <span className="font-semibold">{rows.length}</span>
              </div>
              <div className="rounded-full bg-slate-100 px-4 py-2">
                Showing:{" "}
                <span className="font-semibold">{filteredRows.length}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full overflow-x-auto rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">
          <div className="max-h-[720px] overflow-auto pb-2">
            <table className="w-full min-w-[1900px] border-separate border-spacing-0 text-sm">
              <thead className="sticky top-0 z-30 bg-slate-100 text-left text-slate-700 shadow-sm">
                <tr>
                  <th className="sticky left-0 z-40 bg-slate-100 px-2 py-3 font-semibold">
                    Product
                  </th>
                  <th className="px-2 py-3 font-semibold">Size</th>
                  <th className="px-2 py-3 font-semibold">Paper</th>
                  <th className="px-2 py-3 font-semibold">Finish</th>
                  <th className="px-2 py-3 font-semibold">Sides</th>
                  <th className="px-2 py-3 font-semibold">Qty</th>
                  <th className="px-2 py-3 font-semibold">Sort</th>
                  <th className="px-2 py-3 font-semibold">Your Cost</th>
                  <th className="px-2 py-3 font-semibold">Markup %</th>
                  <th className="px-2 py-3 font-semibold">Shipping</th>
                  <th className="px-2 py-3 font-semibold">Final Price</th>
                  <th className="px-2 py-3 font-semibold">Total</th>
                  <th className="px-2 py-3 font-semibold">Profit</th>
                  <th className="px-2 py-3 font-semibold">Margin</th>
                  <th className="px-2 py-3 font-semibold">Active</th>
                  <th className="px-2 py-3 font-semibold">Actions</th>
                  <th className="px-2 py-3 font-semibold">Status</th>
                </tr>
              </thead>

              <tbody>
                {filteredRows.length === 0 ? (
                  <tr>
                    <td colSpan="17" className="p-8 text-center text-slate-500">
                      No pricing rows found.
                    </td>
                  </tr>
                ) : (
                  filteredRows.map((row) => (
                    <tr key={row.id} className="border-t border-slate-200 align-top">
                      <td className="sticky left-0 z-20 bg-white px-2 py-3 shadow-[2px_0_0_0_rgba(226,232,240,1)]">
                        <select
                          value={row.product_name ?? ""}
                          onChange={(e) =>
                            handleLocalChange(row.id, "product_name", e.target.value)
                          }
                          className="w-40 rounded-xl border border-slate-300 bg-white px-2 py-1.5 text-xs font-semibold text-slate-900 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                        >
                          <option value="">Select Product</option>
                          {getDependentDropdownOptions("product_name", row).map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="px-2 py-3">
                        <select
                          value={row.size ?? ""}
                          onChange={(e) =>
                            handleLocalChange(row.id, "size", e.target.value)
                          }
                          className="w-32 rounded-xl border border-slate-300 bg-white px-2 py-1.5 text-xs outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                        >
                          <option value="">Select Size</option>
                          {getDependentDropdownOptions("size", row).map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="px-2 py-3">
                        <select
                          value={row.paper ?? ""}
                          onChange={(e) =>
                            handleLocalChange(row.id, "paper", e.target.value)
                          }
                          className="w-36 rounded-xl border border-slate-300 bg-white px-2 py-1.5 text-xs outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                        >
                          <option value="">Select Paper</option>
                          {getDependentDropdownOptions("paper", row).map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="px-2 py-3">
                        <select
                          value={row.finish ?? ""}
                          onChange={(e) =>
                            handleLocalChange(row.id, "finish", e.target.value)
                          }
                          className="w-32 rounded-xl border border-slate-300 bg-white px-2 py-1.5 text-xs outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                        >
                          <option value="">Select Finish</option>
                          {getDependentDropdownOptions("finish", row).map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="px-2 py-3">
                        <select
                          value={row.sides ?? ""}
                          onChange={(e) =>
                            handleLocalChange(row.id, "sides", e.target.value)
                          }
                          className="w-36 rounded-xl border border-slate-300 bg-white px-2 py-1.5 text-xs outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                        >
                          <option value="">Select Sides</option>
                          {getDependentDropdownOptions("sides", row).map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="px-2 py-3">
                        <select
                          value={String(row.quantity ?? "")}
                          onChange={(e) =>
                            handleLocalChange(row.id, "quantity", e.target.value)
                          }
                          className="w-24 rounded-xl border border-slate-300 bg-white px-2 py-1.5 text-xs outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                        >
                          <option value="">Qty</option>
                          {getDependentDropdownOptions("quantity", row).map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="px-2 py-3">
                        <input
                          type="number"
                          value={row.sort_order ?? 0}
                          onChange={(e) =>
                            handleLocalChange(row.id, "sort_order", e.target.value)
                          }
                          className="w-20 rounded-xl border border-slate-300 px-2 py-1.5 text-xs outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                        />
                      </td>

                      <td className="px-2 py-3">
                        <input
                          type="number"
                          step="0.01"
                          value={row.your_cost ?? 0}
                          onChange={(e) =>
                            handleLocalChange(row.id, "your_cost", e.target.value)
                          }
                          className="w-24 rounded-xl border border-slate-300 px-2 py-1.5 text-xs outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                        />
                      </td>

                      <td className="px-2 py-3">
                        <input
                          type="number"
                          step="0.01"
                          value={row.markup_percent ?? 0}
                          onChange={(e) =>
                            handleLocalChange(row.id, "markup_percent", e.target.value)
                          }
                          className="w-20 rounded-xl border border-slate-300 px-2 py-1.5 text-xs outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                        />
                      </td>

                      <td className="px-2 py-3">
                        <input
                          type="number"
                          step="0.01"
                          value={row.shipping_cost ?? 0}
                          onChange={(e) =>
                            handleLocalChange(row.id, "shipping_cost", e.target.value)
                          }
                          className="w-24 rounded-xl border border-slate-300 px-2 py-1.5 text-xs outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                        />
                      </td>

                      <td className="px-3 py-4 whitespace-nowrap font-bold text-slate-900">
                        {money(finalPrice(row))}
                      </td>

                      <td className="px-3 py-4 whitespace-nowrap font-bold text-emerald-700">
                        {money(totalWithShipping(row))}
                      </td>

                      <td className="px-3 py-4 whitespace-nowrap font-bold text-blue-700">
                        {money(profit(row))}
                      </td>

                      <td className="px-3 py-4 whitespace-nowrap">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${
                            marginPercent(row) >= 40
                              ? "bg-emerald-100 text-emerald-700"
                              : marginPercent(row) >= 25
                                ? "bg-amber-100 text-amber-700"
                                : "bg-red-100 text-red-700"
                          }`}
                        >
                          {marginPercent(row).toFixed(1)}%
                        </span>
                      </td>

                      <td className="px-3 py-4 whitespace-nowrap">
                        <label className="inline-flex cursor-pointer items-center gap-2">
                          <input
                            type="checkbox"
                            checked={Boolean(row.active)}
                            onChange={(e) =>
                              handleLocalChange(row.id, "active", e.target.checked)
                            }
                            className="h-4 w-4 rounded border-slate-300"
                          />
                          <span className="text-slate-700 text-xs">
                            {row.active ? "On" : "Off"}
                          </span>
                        </label>
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex flex-col gap-2">
                          <button
                            type="button"
                            onClick={() => handleCopyRow(row)}
                            className="rounded-xl bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-700"
                          >
                            Copy
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteRow(row)}
                            disabled={deletingId === row.id}
                            className="rounded-xl bg-red-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
                          >
                            {deletingId === row.id ? "Deleting..." : "Delete"}
                          </button>
                        </div>
                      </td>

                      <td className="px-3 py-4 whitespace-nowrap">
                        {savingId === row.id ? (
                          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                            Saving...
                          </span>
                        ) : deletingId === row.id ? (
                          <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                            Deleting...
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