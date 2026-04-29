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
    <section style={styles.section}>
      <div style={styles.container}>
        
        <div style={styles.header}>
          <h2 style={styles.title}>What Customers Are Saying</h2>
          <p style={styles.subtitle}>
            Real feedback from EnVision Direct customers.
          </p>
        </div>

        <div style={styles.grid}>
          {reviews.map((review) => (
            <div key={review.id} style={styles.card}>

              <div style={styles.stars}>
                {"★".repeat(review.rating)}
                {"☆".repeat(5 - review.rating)}
              </div>

              <p style={styles.comment}>
                “{review.comments || "Great experience with EnVision Direct."}”
              </p>

              <div style={styles.footer}>
                <span style={styles.name}>
                  {review.customer_name || "Verified Customer"}
                </span>

                {review.order_number && (
                  <span style={styles.order}>
                    • {review.order_number}
                  </span>
                )}
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

const styles = {
  section: {
    padding: "90px 20px",
    background: "linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)",
  },

  container: {
    maxWidth: "1200px",
    margin: "0 auto",
  },

  header: {
    textAlign: "center",
    marginBottom: "50px",
  },

  title: {
    fontSize: "36px",
    fontWeight: "800",
    margin: 0,
    color: "#0f172a",
  },

  subtitle: {
    color: "#64748b",
    marginTop: "12px",
    fontSize: "16px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "24px",
  },

  card: {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "22px",
    padding: "26px",
    boxShadow: "0 15px 35px rgba(15, 23, 42, 0.08)",
    transition: "all 0.2s ease",
  },

  stars: {
    color: "#f59e0b",
    fontSize: "22px",
    letterSpacing: "3px",
    marginBottom: "14px",
  },

  comment: {
    color: "#334155",
    lineHeight: "1.7",
    fontSize: "15px",
    margin: 0,
  },

  footer: {
    marginTop: "20px",
    paddingTop: "14px",
    borderTop: "1px solid #e5e7eb",
    fontSize: "14px",
    color: "#64748b",
  },

  name: {
    fontWeight: "600",
    color: "#0f172a",
  },

  order: {
    marginLeft: "6px",
  },
};