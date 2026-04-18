"use client";

import { useState } from "react";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleLogin(e) {
    e.preventDefault();

    try {
      setLoading(true);
      setMessage("");

      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok || !data?.success) {
        throw new Error(data?.error || "Login failed.");
      }

      window.location.href = "/admin";
    } catch (err) {
      setMessage(err.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 px-6 py-12">
      <div className="mx-auto max-w-md">
        <div className="rounded-3xl bg-white p-8 shadow-xl ring-1 ring-slate-200">
          <div className="mb-6">
            <div className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
              EnVision Direct
            </div>
            <h1 className="mt-4 text-3xl font-bold text-slate-900">
              Admin Login
            </h1>
            <p className="mt-2 text-slate-600">
              Enter your admin password to access the dashboard.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                placeholder="Enter admin password"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !password.trim()}
              className="w-full rounded-2xl bg-blue-700 px-5 py-3 text-base font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          {message ? (
            <div className="mt-5 rounded-2xl bg-red-50 p-4 text-sm text-red-700">
              {message}
            </div>
          ) : null}
        </div>
      </div>
    </main>
  );
}