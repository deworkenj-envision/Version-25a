"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function ReviewInner() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order") || "";

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-2xl rounded-3xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200">
        <img
          src="/images/logo-hero.png"
          alt="EnVision Direct"
          className="mx-auto h-24 w-auto object-contain"
        />

        <h1 className="mt-6 text-4xl font-bold text-slate-900">
          How did we do?
        </h1>

        {orderNumber ? (
          <p className="mt-3 text-slate-600">
            Order <span className="font-bold">{orderNumber}</span>
          </p>
        ) : null}

        <p className="mt-4 text-slate-600">
          Thank you for choosing EnVision Direct. We would love your feedback.
        </p>

        <div className="mt-8 grid gap-3">
          <a
            href="https://www.google.com/search?q=EnVision+Direct+reviews"
            target="_blank"
            rel="noreferrer"
            className="rounded-2xl bg-blue-700 px-5 py-4 font-semibold text-white transition hover:bg-blue-800"
          >
            Leave a Google Review
          </a>

          <a
            href="/"
            className="rounded-2xl border border-slate-300 px-5 py-4 font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Back to EnVision Direct
          </a>
        </div>
      </div>
    </main>
  );
}

export default function ReviewPage() {
  return (
    <Suspense fallback={<div>Loading review page...</div>}>
      <ReviewInner />
    </Suspense>
  );
}