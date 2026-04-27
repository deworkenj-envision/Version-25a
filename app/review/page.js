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

      if (!res.ok) {
        throw new Error("Failed to send review");
      }

      setSubmitted(true);
    } catch (err) {
      alert("Something went wrong sending your review.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{
      minHeight: "100vh",
      background: "#f4f7fb",
      padding: "40px 16px",
      fontFamily: "Arial, Helvetica, sans-serif"
    }}>
      <div style={{
        maxWidth: "720px",
        margin: "0 auto",
        background: "#ffffff",
        borderRadius: "24px",
        overflow: "hidden",
        boxShadow: "0 16px 40px rgba(15,43,82,0.12)"
      }}>
        <div style={{
          padding: "24px",
          textAlign: "center",
          borderBottom: "1px solid #e5e7eb"
        }}>
          <img src="/images/logo-hero.png" style={{ maxWidth: "200px" }} />
        </div>

        <div style={{ padding: "32px 24px", textAlign: "center" }}>
          {!submitted ? (
            <>
              <h1 style={{ fontSize: "30px" }}>How did we do?</h1>

              <div style={{ margin: "20px 0" }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    style={{
                      border: "none",
                      background: "transparent",
                      fontSize: "42px",
                      cursor: "pointer",
                      color: star <= activeRating ? "#f59e0b" : "#d1d5db",
                    }}
                  >
                    ★
                  </button>
                ))}
              </div>

              <textarea
                placeholder="Tell us about your experience..."
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                style={{
                  width: "100%",
                  maxWidth: "560px",
                  borderRadius: "14px",
                  padding: "14px",
                  border: "1px solid #ccc"
                }}
              />

              <div style={{ marginTop: "20px" }}>
                <button
                  onClick={handleSubmit}
                  disabled={!rating || loading}
                  style={{
                    background: "#f59e0b",
                    color: "white",
                    padding: "14px 24px",
                    borderRadius: "14px",
                    border: "none",
                    fontWeight: "bold",
                    cursor: "pointer",
                    opacity: !rating || loading ? 0.6 : 1
                  }}
                >
                  {loading ? "Sending..." : "Submit Review"}
                </button>
              </div>
            </>
          ) : (
            <>
              <h1>Thank you!</h1>
              <p>Your review has been sent.</p>
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