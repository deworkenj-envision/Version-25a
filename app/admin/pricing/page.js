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
    "3-ft x 2-ft",
    "4-ft x 2-ft",
    "5-ft x 3-ft",
    "6-ft x 2-ft",
    "6-ft x 3-ft",
    "8-ft x 2-ft",
    "8-ft x 3-ft",
    "8-ft x 4-ft",
    "10-ft x 4-ft",
  ],
  paper: [
    "14pt C2S",
    "14pt Glossy Card Stock",
    "14pt Uncoated",
    "16pt C2S",
    "16pt Glossy Card Stock",
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
    "UV-High Gloss Coating",
    "AQ-Matte Coating ",
    "UV-High Gloss Coating",
  ],
  sides: ["Front Only", "Front and Back"],
  quantity: [
    "1",
    "2",
    "3",
    "4",
    "5",
    "100",
    "250",
    "500",
    "1000",
    "1500",
    "2000",
    "2500",
    "3000",
    "4000",
    "5000",
    "7500",
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
  const [duplicatingSetId, setDuplicatingSetId] = useState(null);
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