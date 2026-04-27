"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function ReviewContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order") || "";
  const orderId = searchParams.get("id") || "";

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
          <h1
            style={{
              margin: 0,
              fontSize: "30px",
              color: "#111827",
            }}
          >
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
            Thank you for choosing EnVision Direct. We would love your feedback.
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

          <div
            style={{
              fontSize: "34px",
              margin: "22px 0",
              letterSpacing: "4px",
            }}
          >
            ⭐ ⭐ ⭐ ⭐ ⭐
          </div>

          <p
            style={{
              color: "#374151",
              lineHeight: "1.7",
              maxWidth: "520px",
              margin: "0 auto",
            }}
          >
            Please send us your review or comments. Your feedback helps us
            improve and helps other customers choose EnVision Direct.
          </p>

          <a
            href={`mailto:orders@envisiondirect.net?subject=Review for Order ${
              orderNumber || orderId
            }`}
            style={{
              display: "inline-block",
              background: "#f59e0b",
              color: "#ffffff",
              textDecoration: "none",
              padding: "15px 24px",
              borderRadius: "14px",
              fontWeight: "900",
              marginTop: "24px",
            }}
          >
            Send Review
          </a>
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