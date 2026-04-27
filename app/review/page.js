"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

function ReviewContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order") || "";
  const orderId = searchParams.get("id") || "";

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comments, setComments] = useState("");

  const activeRating = hoverRating || rating;

  const mailtoHref = useMemo(() => {
    const subject = "A Customer Left a Review!";

    const body = [
      "A customer left a review for EnVision Direct.",
      "",
      `Order Number: ${orderNumber || "Not provided"}`,
      `Order ID: ${orderId || "Not provided"}`,
      `Rating: ${rating ? `${rating} out of 5 stars` : "Not selected"}`,
      "",
      "Comments:",
      comments || "No comments provided.",
    ].join("\n");

    return `mailto:orders@envisiondirect.net?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  }, [orderNumber, orderId, rating, comments]);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f4f7fb",
        padding: "40px 16px",
        fontFamily: "Arial, Helvetica, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "720px",
          margin: "0 auto",
          background: "#ffffff",
          border: "1px solid #dbe6f3",
          borderRadius: "24px",
          overflow: "hidden",
          boxShadow: "0 16px 40px rgba(15,43,82,0.12)",
        }}
      >
        <div
          style={{
            padding: "24px",
            textAlign: "center",
            borderBottom: "1px solid #e5e7eb",
            background: "#ffffff",
          }}
        >
          <img
            src="/images/logo-hero.png"
            alt="EnVision Direct"
            style={{
              maxWidth: "200px",
              width: "100%",
              height: "auto",
            }}
          />
        </div>

        <div
          style={{
            padding: "32px 24px",
            textAlign: "center",
          }}
        >
          <h1 style={{ margin: 0, fontSize: "30px", color: "#111827" }}>
            How did we do?
          </h1>

          <p
            style={{
              marginTop: "10px",
              color: "#6b7280",
              fontSize: "16px",
              lineHeight: "1.6",
            }}
          >
            Thank you for choosing EnVision Direct. Please rate your experience.
          </p>

          {orderNumber ? (
            <div
              style={{
                margin: "24px auto",
                maxWidth: "420px",
                background: "#f8fafc",
                border: "1px solid #e5e7eb",
                borderRadius: "16px",
                padding: "16px",
                color: "#111827",
              }}
            >
              <strong>Order Number:</strong> {orderNumber}
            </div>
          ) : null}

          <div style={{ margin: "26px 0 10px" }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                aria-label={`${star} star${star > 1 ? "s" : ""}`}
                style={{
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  fontSize: "42px",
                  padding: "4px",
                  color: star <= activeRating ? "#f59e0b" : "#d1d5db",
                  transition: "transform 0.15s ease, color 0.15s ease",
                  transform: star <= activeRating ? "scale(1.08)" : "scale(1)",
                }}
              >
                ★
              </button>
            ))}
          </div>

          <p
            style={{
              color: "#6b7280",
              fontSize: "14px",
              marginBottom: "22px",
            }}
          >
            {rating ? `You selected ${rating} out of 5 stars.` : "Click a star rating."}
          </p>

          <textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Tell us about your experience..."
            rows={6}
            style={{
              width: "100%",
              maxWidth: "560px",
              boxSizing: "border-box",
              border: "1px solid #d1d5db",
              borderRadius: "16px",
              padding: "16px",
              fontSize: "15px",
              lineHeight: "1.6",
              color: "#111827",
              outline: "none",
              resize: "vertical",
              fontFamily: "Arial, Helvetica, sans-serif",
              background: "#ffffff",
            }}
          />

          <div style={{ marginTop: "24px" }}>
            <a
              href={mailtoHref}
              style={{
                display: "inline-block",
                background: rating ? "#f59e0b" : "#9ca3af",
                color: "#ffffff",
                textDecoration: "none",
                padding: "15px 24px",
                borderRadius: "14px",
                fontWeight: "900",
                pointerEvents: rating ? "auto" : "none",
              }}
            >
              Send Review
            </a>
          </div>

          {!rating ? (
            <p style={{ marginTop: "12px", color: "#ef4444", fontSize: "13px" }}>
              Please choose a star rating before sending.
            </p>
          ) : null}
        </div>
      </div>
    </main>
  );
}

export default function ReviewPage() {
  return (
    <Suspense fallback={<div>Loading review page...</div>}>
      <ReviewContent />
    </Suspense>
  );
}