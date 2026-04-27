"use client";

import { useEffect, useState } from "react";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  async function loadReviews() {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/reviews", { cache: "no-store" });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed to load reviews.");
      }

      setReviews(data.reviews || []);
    } catch (err) {
      setMessage(err.message || "Failed to load reviews.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReviews();
  }, []);

  async function toggleApproved(review) {
    try {
      setMessage("");

      const res = await fetch("/api/admin/reviews", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: review.id,
          is_approved: !review.is_approved,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed to update review.");
      }

      await loadReviews();
    } catch (err) {
      setMessage(err.message || "Failed to update review.");
    }
  }

  async function deleteReview(review) {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this review?"
    );

    if (!confirmed) return;

    try {
      setMessage("");

      const res = await fetch("/api/admin/reviews", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: review.id }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed to delete review.");
      }

      await loadReviews();
    } catch (err) {
      setMessage(err.message || "Failed to delete review.");
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">
              Review Management
            </h1>
            <p className="mt-2 text-slate-600">
              Approve, hide, or delete customer reviews shown on the homepage.
            </p>
          </div>

          <button
            onClick={loadReviews}
            className="rounded-2xl bg-blue-600 px-5 py-3 font-bold text-white hover:bg-blue-700"
          >
            Refresh
          </button>
        </div>

        {message ? (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 font-semibold text-red-700">
            {message}
          </div>
        ) : null}

        {loading ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center font-bold text-slate-600 shadow-sm">
            Loading reviews...
          </div>
        ) : reviews.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">No reviews yet</h2>
            <p className="mt-2 text-slate-600">
              Customer reviews will appear here after they submit them.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px] border-collapse text-left">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="px-5 py-4 text-sm font-extrabold text-slate-700">
                      Status
                    </th>
                    <th className="px-5 py-4 text-sm font-extrabold text-slate-700">
                      Rating
                    </th>
                    <th className="px-5 py-4 text-sm font-extrabold text-slate-700">
                      Review
                    </th>
                    <th className="px-5 py-4 text-sm font-extrabold text-slate-700">
                      Customer
                    </th>
                    <th className="px-5 py-4 text-sm font-extrabold text-slate-700">
                      Order
                    </th>
                    <th className="px-5 py-4 text-sm font-extrabold text-slate-700">
                      Date
                    </th>
                    <th className="px-5 py-4 text-sm font-extrabold text-slate-700">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {reviews.map((review) => (
                    <tr
                      key={review.id}
                      className="border-t border-slate-200 align-top"
                    >
                      <td className="px-5 py-4">
                        <span
                          className={
                            review.is_approved
                              ? "rounded-full bg-green-100 px-3 py-1 text-xs font-extrabold text-green-700"
                              : "rounded-full bg-slate-200 px-3 py-1 text-xs font-extrabold text-slate-700"
                          }
                        >
                          {review.is_approved ? "Approved" : "Hidden"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="whitespace-nowrap text-lg text-amber-500">
                          {"★".repeat(Number(review.rating || 0))}
                          {"☆".repeat(5 - Number(review.rating || 0))}
                        </div>
                        <div className="mt-1 text-xs font-bold text-slate-500">
                          {review.rating}/5
                        </div>
                      </td>

                      <td className="max-w-md px-5 py-4">
                        <p className="line-clamp-4 text-sm leading-6 text-slate-700">
                          {review.comments || "No comments provided."}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-700">
                        <div className="font-bold">
                          {review.customer_name || "Verified Customer"}
                        </div>
                        <div className="mt-1 text-xs text-slate-500">
                          {review.customer_email || "No email"}
                        </div>
                      </td>

                      <td className="px-5 py-4 text-sm font-bold text-slate-700">
                        {review.order_number || "—"}
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {review.created_at
                          ? new Date(review.created_at).toLocaleDateString()
                          : "—"}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => toggleApproved(review)}
                            className={
                              review.is_approved
                                ? "rounded-xl bg-slate-700 px-4 py-2 text-sm font-bold text-white hover:bg-slate-800"
                                : "rounded-xl bg-green-600 px-4 py-2 text-sm font-bold text-white hover:bg-green-700"
                            }
                          >
                            {review.is_approved ? "Hide" : "Approve"}
                          </button>

                          <button
                            onClick={() => deleteReview(review)}
                            className="rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700"
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
        )}
      </div>
    </main>
  );
}