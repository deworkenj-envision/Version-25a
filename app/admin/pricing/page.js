"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const emptyForm = {
  product_name: "",
  size: "",
  paper: "",
  finish: "",
  sides: "",
  quantity: "",
  price: "",
  sort_order: "",
  active: true,
};

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

  const [form, setForm] = useState(emptyForm);
  const [csvFile, setCsvFile] = useState(null);
  const [replaceExisting, setReplaceExisting] = useState(false);

  const createFormRef = useRef(null);

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
        price: Number(form.price),
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
        Number.isNaN(payload.price)
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
      price:
        row.price !== null && row.price !== undefined ? String(row.price) : "",
      sort_order:
        row.sort_order !== null && row.sort_order !== undefined
          ? String(row.sort_order)
          : "",
      active: Boolean(row.active),
    });

    setMessage(
      `Copied row for ${row.product_name}. Update quantity or price, then click Add New Pricing Row.`
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
            price, sort_order, active
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
            <input
              type="text"
              placeholder="Product Name"
              value={form.product_name}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, product_name: e.target.value }))
              }
              className="rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
            />
            <input
              type="text"
              placeholder="Size"
              value={form.size}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, size: e.target.value }))
              }
              className="rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
            />
            <input
              type="text"
              placeholder="Paper"
              value={form.paper}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, paper: e.target.value }))
              }
              className="rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
            />
            <input
              type="text"
              placeholder="Finish"
              value={form.finish}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, finish: e.target.value }))
              }
              className="rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
            />
            <input
              type="text"
              placeholder="Sides"
              value={form.sides}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, sides: e.target.value }))
              }
              className="rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
            />
            <input
              type="number"
              placeholder="Quantity"
              value={form.quantity}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, quantity: e.target.value }))
              }
              className="rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
            />
            <input
              type="number"
              step="0.01"
              placeholder="Price"
              value={form.price}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, price: e.target.value }))
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

            <label className="flex items-center gap-3 rounded-2xl border border-slate-300 px-4 py-3 xl:col-span-2">
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

            <div className="xl:col-span-2">
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
        </div>

        <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1120px] text-sm">
              <thead className="bg-slate-100 text-left text-slate-700">
                <tr>
                  <th className="px-3 py-4 font-semibold">Product</th>
                  <th className="px-3 py-4 font-semibold">Size</th>
                  <th className="px-3 py-4 font-semibold">Paper</th>
                  <th className="px-3 py-4 font-semibold">Finish</th>
                  <th className="px-3 py-4 font-semibold">Sides</th>
                  <th className="px-3 py-4 font-semibold">Qty</th>
                  <th className="px-3 py-4 font-semibold">Sort</th>
                  <th className="px-3 py-4 font-semibold">Price</th>
                  <th className="px-3 py-4 font-semibold">Active</th>
                  <th className="px-3 py-4 font-semibold">Actions</th>
                  <th className="px-3 py-4 font-semibold">Status</th>
                </tr>
              </thead>

              <tbody>
                {filteredRows.length === 0 ? (
                  <tr>
                    <td colSpan="11" className="p-8 text-center text-slate-500">
                      No pricing rows found.
                    </td>
                  </tr>
                ) : (
                  filteredRows.map((row) => (
                    <tr key={row.id} className="border-t border-slate-200 align-top">
                      <td className="px-3 py-4 font-medium text-slate-900 whitespace-nowrap">
                        {row.product_name}
                      </td>
                      <td className="px-3 py-4 text-slate-700 whitespace-nowrap">
                        {row.size}
                      </td>
                      <td className="px-3 py-4 text-slate-700 whitespace-nowrap">
                        {row.paper}
                      </td>
                      <td className="px-3 py-4 text-slate-700 whitespace-nowrap">
                        {row.finish}
                      </td>
                      <td className="px-3 py-4 text-slate-700 whitespace-nowrap">
                        {row.sides}
                      </td>
                      <td className="px-3 py-4 text-slate-700 whitespace-nowrap">
                        {row.quantity}
                      </td>

                      <td className="px-3 py-4">
                        <input
                          type="number"
                          value={row.sort_order ?? 0}
                          onChange={(e) =>
                            updateRow(row.id, "sort_order", e.target.value)
                          }
                          className="w-20 rounded-xl border border-slate-300 px-2 py-2 text-sm outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                        />
                      </td>

                      <td className="px-3 py-4">
                        <input
                          type="number"
                          step="0.01"
                          value={row.price ?? 0}
                          onChange={(e) =>
                            updateRow(row.id, "price", e.target.value)
                          }
                          className="w-24 rounded-xl border border-slate-300 px-2 py-2 text-sm outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                        />
                      </td>

                      <td className="px-3 py-4 whitespace-nowrap">
                        <label className="inline-flex cursor-pointer items-center gap-2">
                          <input
                            type="checkbox"
                            checked={Boolean(row.active)}
                            onChange={(e) =>
                              updateRow(row.id, "active", e.target.checked)
                            }
                            className="h-4 w-4 rounded border-slate-300"
                          />
                          <span className="text-slate-700 text-xs">
                            {row.active ? "On" : "Off"}
                          </span>
                        </label>
                      </td>

                      <td className="px-3 py-4">
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