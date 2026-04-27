"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const TABLE_NAME = "pricing";

function toNumber(value) {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
}

function calculateRow(row) {
  const cost = toNumber(row.cost);
  const markup = toNumber(row.markup);
  const quantity = toNumber(row.quantity);

  const finalPrice = cost + cost * (markup / 100);
  const total = finalPrice * quantity;

  return {
    ...row,
    cost,
    markup,
    quantity,
    final_price: Number(finalPrice.toFixed(2)),
    total: Number(total.toFixed(2)),
  };
}

export default function AdminPricingPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingIds, setSavingIds] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    loadPricing();
  }, []);

  async function loadPricing() {
    setLoading(true);
    setErrorMessage("");

    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select("*")
      .order("product", { ascending: true })
      .order("size", { ascending: true });

    if (error) {
      console.error("Load pricing error:", error);
      setErrorMessage(error.message);
      setRows([]);
    } else {
      setRows((data || []).map(calculateRow));
    }

    setLoading(false);
  }

  async function saveRow(row) {
    if (!row.id) return;

    setSavingIds((prev) => ({ ...prev, [row.id]: true }));

    const cleanRow = calculateRow(row);

    const { error } = await supabase
      .from(TABLE_NAME)
      .update({
        product: cleanRow.product || "",
        size: cleanRow.size || "",
        paper: cleanRow.paper || "",
        finish: cleanRow.finish || "",
        sides: cleanRow.sides || "",
        quantity: cleanRow.quantity,
        cost: cleanRow.cost,
        markup: cleanRow.markup,
        final_price: cleanRow.final_price,
        total: cleanRow.total,
      })
      .eq("id", cleanRow.id);

    if (error) {
      console.error("Save pricing error:", error);
      setErrorMessage(`Save failed: ${error.message}`);
    } else {
      setErrorMessage("");
    }

    setSavingIds((prev) => ({ ...prev, [row.id]: false }));
  }

  function updateCell(rowId, field, value) {
    setRows((currentRows) => {
      const updatedRows = currentRows.map((row) => {
        if (row.id !== rowId) return row;

        const updatedRow = calculateRow({
          ...row,
          [field]:
            field === "quantity" || field === "cost" || field === "markup"
              ? toNumber(value)
              : value,
        });

        saveRow(updatedRow);
        return updatedRow;
      });

      return updatedRows;
    });
  }

  async function addRow() {
    const newRow = calculateRow({
      product: "New Product",
      size: "",
      paper: "",
      finish: "",
      sides: "",
      quantity: 0,
      cost: 0,
      markup: 0,
      final_price: 0,
      total: 0,
    });

    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert([newRow])
      .select()
      .single();

    if (error) {
      console.error("Add row error:", error);
      setErrorMessage(`Add row failed: ${error.message}`);
      return;
    }

    setRows((prev) => [calculateRow(data), ...prev]);
  }

  async function deleteRow(rowId) {
    const confirmed = window.confirm("Delete this pricing row?");
    if (!confirmed) return;

    const { error } = await supabase.from(TABLE_NAME).delete().eq("id", rowId);

    if (error) {
      console.error("Delete row error:", error);
      setErrorMessage(`Delete failed: ${error.message}`);
      return;
    }

    setRows((prev) => prev.filter((row) => row.id !== rowId));
  }

  async function duplicateRow(row) {
    const copy = {
      product: row.product || "",
      size: row.size || "",
      paper: row.paper || "",
      finish: row.finish || "",
      sides: row.sides || "",
      quantity: row.quantity || 0,
      cost: row.cost || 0,
      markup: row.markup || 0,
      final_price: row.final_price || 0,
      total: row.total || 0,
    };

    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert([copy])
      .select()
      .single();

    if (error) {
      console.error("Duplicate row error:", error);
      setErrorMessage(`Duplicate failed: ${error.message}`);
      return;
    }

    setRows((prev) => [calculateRow(data), ...prev]);
  }

  function applyBulkMarkup(amount) {
    const markup = toNumber(amount);

    const updatedRows = rows.map((row) => calculateRow({ ...row, markup }));
    setRows(updatedRows);

    updatedRows.forEach((row) => saveRow(row));
  }

  const summary = useMemo(() => {
    return {
      rowCount: rows.length,
      avgMarkup:
        rows.length > 0
          ? (
              rows.reduce((sum, row) => sum + toNumber(row.markup), 0) /
              rows.length
            ).toFixed(2)
          : "0.00",
    };
  }, [rows]);

  function downloadCsvTemplate() {
    const csv =
      "product,size,paper,finish,sides,quantity,cost,markup,final_price,total\n" +
      "Business Cards,3.5x2,16pt Matte,Matte,Front and Back,500,25,100,50,25000\n";

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "pricing-template.csv";
    link.click();

    URL.revokeObjectURL(url);
  }

  if (loading) {
    return (
      <main style={styles.page}>
        <p>Loading pricing...</p>
      </main>
    );
  }

  return (
    <main style={styles.page}>
      <div style={styles.header}>
        <div>
          <p style={styles.eyebrow}>Admin Pricing</p>
          <h1 style={styles.title}>Pricing Manager</h1>
          <p style={styles.subtitle}>
            Edit product pricing, markup, quantities, and totals. Changes
            autosave directly to Supabase.
          </p>
        </div>

        <div style={styles.headerActions}>
          <button style={styles.secondaryButton} onClick={downloadCsvTemplate}>
            Download CSV Template
          </button>
          <button style={styles.primaryButton} onClick={addRow}>
            Add Row
          </button>
        </div>
      </div>

      {errorMessage ? <div style={styles.error}>{errorMessage}</div> : null}

      <section style={styles.cards}>
        <div style={styles.card}>
          <p style={styles.cardLabel}>Total Rows</p>
          <h2 style={styles.cardValue}>{summary.rowCount}</h2>
        </div>

        <div style={styles.card}>
          <p style={styles.cardLabel}>Average Markup</p>
          <h2 style={styles.cardValue}>{summary.avgMarkup}%</h2>
        </div>

        <div style={styles.card}>
          <p style={styles.cardLabel}>Bulk Markup</p>
          <div style={styles.bulkRow}>
            <input
              style={styles.bulkInput}
              type="number"
              placeholder="Markup %"
              onKeyDown={(e) => {
                if (e.key === "Enter") applyBulkMarkup(e.currentTarget.value);
              }}
            />
            <button
              style={styles.smallButton}
              onClick={(e) => {
                const input = e.currentTarget.previousSibling;
                applyBulkMarkup(input.value);
              }}
            >
              Apply
            </button>
          </div>
        </div>
      </section>

      <section style={styles.tableShell}>
        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={{ ...styles.th, ...styles.stickyCol }}>Product</th>
                <th style={styles.th}>Size</th>
                <th style={styles.th}>Paper</th>
                <th style={styles.th}>Finish</th>
                <th style={styles.th}>Sides</th>
                <th style={styles.th}>Qty</th>
                <th style={styles.th}>Cost</th>
                <th style={styles.th}>Markup %</th>
                <th style={styles.th}>Final Price</th>
                <th style={styles.th}>Total</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td style={{ ...styles.td, ...styles.stickyColBody }}>
                    <input
                      style={styles.input}
                      value={row.product || ""}
                      onChange={(e) =>
                        updateCell(row.id, "product", e.target.value)
                      }
                    />
                  </td>

                  <td style={styles.td}>
                    <input
                      style={styles.input}
                      value={row.size || ""}
                      onChange={(e) =>
                        updateCell(row.id, "size", e.target.value)
                      }
                    />
                  </td>

                  <td style={styles.td}>
                    <input
                      style={styles.input}
                      value={row.paper || ""}
                      onChange={(e) =>
                        updateCell(row.id, "paper", e.target.value)
                      }
                    />
                  </td>

                  <td style={styles.td}>
                    <input
                      style={styles.input}
                      value={row.finish || ""}
                      onChange={(e) =>
                        updateCell(row.id, "finish", e.target.value)
                      }
                    />
                  </td>

                  <td style={styles.td}>
                    <input
                      style={styles.input}
                      value={row.sides || ""}
                      onChange={(e) =>
                        updateCell(row.id, "sides", e.target.value)
                      }
                    />
                  </td>

                  <td style={styles.td}>
                    <input
                      style={styles.numberInput}
                      type="number"
                      value={row.quantity ?? 0}
                      onChange={(e) =>
                        updateCell(row.id, "quantity", e.target.value)
                      }
                    />
                  </td>

                  <td style={styles.td}>
                    <input
                      style={styles.numberInput}
                      type="number"
                      step="0.01"
                      value={row.cost ?? 0}
                      onChange={(e) =>
                        updateCell(row.id, "cost", e.target.value)
                      }
                    />
                  </td>

                  <td style={styles.td}>
                    <input
                      style={styles.numberInput}
                      type="number"
                      step="0.01"
                      value={row.markup ?? 0}
                      onChange={(e) =>
                        updateCell(row.id, "markup", e.target.value)
                      }
                    />
                  </td>

                  <td style={styles.td}>
                    <strong>${toNumber(row.final_price).toFixed(2)}</strong>
                  </td>

                  <td style={styles.td}>
                    <strong>${toNumber(row.total).toFixed(2)}</strong>
                  </td>

                  <td style={styles.td}>
                    <span style={styles.saveBadge}>
                      {savingIds[row.id] ? "Saving..." : "Saved"}
                    </span>
                  </td>

                  <td style={styles.td}>
                    <div style={styles.actionRow}>
                      <button
                        style={styles.smallButton}
                        onClick={() => duplicateRow(row)}
                      >
                        Duplicate
                      </button>
                      <button
                        style={styles.dangerButton}
                        onClick={() => deleteRow(row.id)}
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
      </section>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f6f8fb",
    padding: "32px",
    color: "#0f172a",
    fontFamily:
      "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    gap: "24px",
    alignItems: "flex-start",
    marginBottom: "24px",
  },
  eyebrow: {
    color: "#2563eb",
    fontWeight: 800,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    margin: 0,
    fontSize: "12px",
  },
  title: {
    fontSize: "36px",
    margin: "6px 0",
    fontWeight: 900,
  },
  subtitle: {
    margin: 0,
    color: "#64748b",
    fontSize: "15px",
  },
  headerActions: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
  },
  primaryButton: {
    border: "0",
    background: "#2563eb",
    color: "white",
    padding: "12px 18px",
    borderRadius: "12px",
    fontWeight: 800,
    cursor: "pointer",
    boxShadow: "0 12px 24px rgba(37, 99, 235, 0.25)",
  },
  secondaryButton: {
    border: "1px solid #cbd5e1",
    background: "white",
    color: "#0f172a",
    padding: "12px 18px",
    borderRadius: "12px",
    fontWeight: 800,
    cursor: "pointer",
  },
  error: {
    background: "#fee2e2",
    border: "1px solid #fecaca",
    color: "#991b1b",
    padding: "12px 14px",
    borderRadius: "12px",
    marginBottom: "18px",
    fontWeight: 700,
  },
  cards: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: "16px",
    marginBottom: "24px",
  },
  card: {
    background: "white",
    border: "1px solid #e2e8f0",
    borderRadius: "18px",
    padding: "20px",
    boxShadow: "0 12px 32px rgba(15, 23, 42, 0.06)",
  },
  cardLabel: {
    color: "#64748b",
    margin: 0,
    fontSize: "13px",
    fontWeight: 800,
  },
  cardValue: {
    margin: "8px 0 0",
    fontSize: "28px",
  },
  bulkRow: {
    display: "flex",
    gap: "8px",
    marginTop: "10px",
  },
  bulkInput: {
    width: "100%",
    border: "1px solid #cbd5e1",
    borderRadius: "10px",
    padding: "10px",
    fontWeight: 700,
  },
  tableShell: {
    background: "white",
    border: "1px solid #e2e8f0",
    borderRadius: "20px",
    boxShadow: "0 16px 40px rgba(15, 23, 42, 0.08)",
    overflow: "hidden",
  },
  tableWrap: {
    overflow: "auto",
    maxHeight: "70vh",
  },
  table: {
    borderCollapse: "separate",
    borderSpacing: 0,
    width: "100%",
    minWidth: "1450px",
  },
  th: {
    position: "sticky",
    top: 0,
    zIndex: 5,
    background: "#0f172a",
    color: "white",
    textAlign: "left",
    padding: "14px",
    fontSize: "13px",
    whiteSpace: "nowrap",
  },
  td: {
    borderBottom: "1px solid #e2e8f0",
    padding: "10px",
    background: "white",
    verticalAlign: "middle",
    whiteSpace: "nowrap",
  },
  stickyCol: {
    left: 0,
    zIndex: 8,
  },
  stickyColBody: {
    position: "sticky",
    left: 0,
    zIndex: 4,
    background: "white",
  },
  input: {
    width: "180px",
    border: "1px solid #cbd5e1",
    borderRadius: "10px",
    padding: "10px",
    fontWeight: 700,
  },
  numberInput: {
    width: "110px",
    border: "1px solid #cbd5e1",
    borderRadius: "10px",
    padding: "10px",
    fontWeight: 700,
  },
  saveBadge: {
    background: "#dcfce7",
    color: "#166534",
    padding: "6px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: 900,
  },
  actionRow: {
    display: "flex",
    gap: "8px",
  },
  smallButton: {
    border: "0",
    background: "#0f172a",
    color: "white",
    padding: "9px 12px",
    borderRadius: "10px",
    fontWeight: 800,
    cursor: "pointer",
  },
  dangerButton: {
    border: "0",
    background: "#ef4444",
    color: "white",
    padding: "9px 12px",
    borderRadius: "10px",
    fontWeight: 800,
    cursor: "pointer",
  },
};