"use client";

import { Suspense, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

function TrackRedirectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token =
      searchParams.get("token") ||
      searchParams.get("tracking_token") ||
      searchParams.get("t");

    if (token) {
      router.replace(`/track/${encodeURIComponent(token)}`);
    }
  }, [router, searchParams]);

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-5xl items-center justify-center px-6 py-12">
        <div className="w-full rounded-[32px] border border-white/10 bg-slate-900 p-8 shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-2xl font-black text-slate-950">
              EV
            </div>

            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-300">
              EnVision Direct
            </p>

            <h1 className="mt-3 text-4xl font-bold tracking-tight">
              Track Your Order
            </h1>

            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-300">
              Checking your secure tracking link...
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-800 p-6 text-center">
            <h2 className="text-xl font-semibold">
              Secure Tracking Link Required
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-300">
              If this page does not redirect automatically, please open the tracking
              link from your order, shipped, or delivered email.
            </p>

            <Link
              href="/"
              className="mt-6 inline-flex rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:opacity-90"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={null}>
      <TrackRedirectContent />
    </Suspense>
  );
}