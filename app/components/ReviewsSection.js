"use client";

import { useEffect, useState } from "react";

export default function ReviewsSection() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    async function loadReviews() {
      try {
        const res = await fetch("/api/reviews");
        const data = await res.json();

        if (res.ok) {
          setReviews(data.reviews || []);
        }
      } catch (err) {
        console.error("Failed to load reviews:", err);
      }
    }

    loadReviews();
  }, []);

  if (!reviews.length) return null;

  return (
    <section style={{ padding: "70px 20px", background: "#f8fafc" }}>
      <div style={{ maxWidth: "1180px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "34px" }}>
          <h2 style={{ fontSize: "34px", margin: 0, color: "#111827" }}>
            What Customers Are Saying
          </h2>
          <p style={{ color: "#6b7280", marginTop: "10px" }}>
            Real feedback from EnVision Direct customers.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "20px",
          }}
        >
          {reviews.map((review) => (
            <div
              key={review.id}
              style={{
                background: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: "20px",
                padding: "22px",
                boxShadow: "0 10px 25px rgba(15,43,82,0.08)",
              }}
            >
              <div
                style={{
                  color: "#f59e0b",
                  fontSize: "22px",
                  letterSpacing: "2px",
                  marginBottom: "12px",
                }}
              >
                {"★".repeat(review.rating)}
                {"☆".repeat(5 - review.rating)}
              </div>

              <p style={{ color: "#374151", lineHeight: "1.7", margin: 0 }}>
                “{review.comments || "Great experience with EnVision Direct."}”
              </p>

              <div
                style={{
                  marginTop: "18px",
                  paddingTop: "14px",
                  borderTop: "1px solid #e5e7eb",
                  color: "#6b7280",
                  fontSize: "14px",
                }}
              >
                {review.customer_name || "Verified Customer"}
                {review.order_number ? ` • ${review.order_number}` : ""}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}