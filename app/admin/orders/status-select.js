"use client";

import { useEffect, useState } from "react";

const statuses = [
  "pending_review",
  "paid",
  "approved",
  "in_production",
  "shipped",
  "completed",
];

export default function StatusSelect({ id, currentStatus }) {
  const [status, setStatus] = useState(currentStatus);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setStatus(currentStatus);
  }, [currentStatus]);

  async function handleChange(e) {
    const newStatus = e.target.value;
    setStatus(newStatus);
    setSaving(true);

    try {
      const response = await fetch("/api/orders", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          status: newStatus,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Failed to update status.");
        setStatus(currentStatus);
      } else {
        window.location.reload();
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong while updating status.");
      setStatus(currentStatus);
    } finally {
      setSaving(false);
    }
  }

  return (
    <select
      value={status}
      onChange={handleChange}
      disabled={saving}
      className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 disabled:opacity-60"
    >
      {statuses.map((item) => (
        <option key={item} value={item}>
          {item}
        </option>
      ))}
    </select>
  );
}
