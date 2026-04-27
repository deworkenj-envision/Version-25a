"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";

function ReviewContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order") || "";
  const orderId = searchParams.get("id") || "";

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comments, setComments] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const activeRating = hoverRating || rating;

  async function handleSubmit() {
    if (!rating) return;

    setLoading(true);

    try {
      const res = await fetch("/api/review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderNumber,
          orderId,
          rating,
          comments,
        }),
      });

      if (!res.ok) throw new Error("Failed to submit review");

      setSubmitted(true);
    } catch (err) {
      alert("Something went wrong sending your review.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f4f7fb] px-4 py-10">
      <div className="mx-auto max-w-3xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
        <div className="border-b border-slate-200 bg-white p-6 text-center">
          <img
            src="/images/logo-hero.png"
            alt="EnVision Direct"
            className="mx-auto h-auto w-full max-w-[200px]"
          />
        </div>

        <div className="p-8 text-center">
          {!submitted ? (
            <>
              <h1 className="text-3xl font-extrabold text-slate-900">
                How did we do?
              </h1>

              <p className="mt-3 text-slate-600">
                Thank you for choosing EnVision Direct. Please rate your
                experience.
              </p>

              {orderNumber ? (
                <div className="mx-auto mt-6 max-w-md rounded-2xl border border-slate-200 bg-slate-50 p-4 text-slate-900">
                  <strong>Order Number:</strong> {orderNumber}
                </div>
              ) : null}

              <div className="mt-8">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="px-1 text-5xl transition"
                    style={{
                      color: star <= activeRating ? "#f59e0b" : "#d1d5db",
                    }}
                  >
                    ★
                  </button>
                ))}
              </div>

              <p className="mt-3 text-sm text-slate-500">
                {rating
                  ? `You selected ${rating} out of 5 stars.`
                  : "Click a star rating."}
              </p>

              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Tell us about your experience..."
                rows={6}
                className="mt-6 w-full max-w-xl rounded-2xl border border-slate-300 p-4 text-sm outline-none"
              />

              <div className="mt-6">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!rating || loading}
                  className="rounded-2xl bg-amber-500 px-8 py-4 font-extrabold text-white disabled:opacity-50"
                >
                  {loading ? "Sending..." : "Submit Review"}
                </button>
              </div>
            </>
          ) : (
            <>
              <h1 className="text-3xl font-extrabold text-slate-900">
                Thank you!
              </h1>
              <p className="mt-3 text-slate-600">
                Your review has been sent.
              </p>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

export default function ReviewPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ReviewContent />
    </Suspense>
  );
}