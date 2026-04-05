export const dynamic = "force-dynamic";

import Link from "next/link";
import { supabaseAdmin } from "../../lib/supabaseAdmin";

async function getOrderBySessionId(sessionId) {
  if (!sessionId) return null;

  const { data, error } = await supabaseAdmin
    .from("orders")
    .select("*")
    .eq("stripe_session_id", sessionId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("Error loading order by session id:", error);
    return null;
  }

  return data;
}

function isImageFile(url = "") {
  const lower = String(url).toLowerCase();
  return (
    lower.endsWith(".png") ||
    lower.endsWith(".jpg") ||
    lower.endsWith(".jpeg") ||
    lower.endsWith(".webp") ||
    lower.endsWith(".gif")
  );
}

export default async function OrderSuccessPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const sessionId = resolvedSearchParams?.session_id || "";
  const order = await getOrderBySessionId(sessionId);
  const artworkUrl = order?.artwork_url || "";
  const canPreviewImage = isImageFile(artworkUrl);

  return (
    <main className="min-h-screen bg-[#f7f7f8] px-6 py-10">
      <div className="mx-auto max-w-4xl rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6 inline-flex rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-700">
          Order Received
        </div>

        <h1 className="mb-3 text-5xl font-bold tracking-tight text-slate-950">
          Your order has been received
        </h1>

        <p className="mb-8 text-xl text-slate-600">
          {order
            ? "Thank you. Your payment was successful and your order details are below."
            : "We could not load the full order details, but your request was submitted."}
        </p>

        <div className="mb-8 rounded-[24px] bg-slate-50 p-8">
          <div className="grid grid-cols-2 gap-y-5 text-lg">
            <div className="text-slate-500">Order Number</div>
            <div className="text-right font-semibold text-slate-900">
              {order?.order_number || order?.id || "Unavailable"}
            </div>

            <div className="text-slate-500">Product</div>
            <div className="text-right font-semibold text-slate-900">
              {order?.product_name || "Unavailable"}
            </div>

            <div className="text-slate-500">Quantity</div>
            <div className="text-right font-semibold text-slate-900">
              {order?.quantity ?? "Unavailable"}
            </div>

            <div className="text-slate-500">Paper</div>
            <div className="text-right font-semibold text-slate-900">
              {order?.paper || "Unavailable"}
            </div>

            <div className="text-slate-500">Finish</div>
            <div className="text-right font-semibold text-slate-900">
              {order?.finish || "Unavailable"}
            </div>

            <div className="text-slate-500">Status</div>
            <div className="text-right font-semibold text-amber-600">
              {order?.status || "Paid"}
            </div>
          </div>
        </div>

        {artworkUrl && (
          <div className="mb-8 rounded-[24px] border border-slate-200 bg-white p-6">
            <h2 className="mb-3 text-2xl font-semibold text-slate-900">
              Uploaded Artwork
            </h2>

            {order?.file_name && (
              <p className="mb-3 text-sm text-slate-500">
                File: {order.file_name}
              </p>
            )}

            {canPreviewImage ? (
              <div className="mb-4 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-3">
                <img
                  src={artworkUrl}
                  alt="Uploaded artwork preview"
                  className="max-h-[420px] w-full rounded-xl object-contain"
                />
              </div>
            ) : (
              <p className="mb-4 text-slate-600">
                Preview is not available for this file type, but your artwork was uploaded successfully.
              </p>
            )}

            <a
              href={artworkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
            >
              View Uploaded File
            </a>
          </div>
        )}

        <div className="flex flex-wrap gap-4">
          <Link
            href="/order"
            className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-6 py-4 text-lg font-semibold text-white hover:bg-blue-700"
          >
            Start Another Order
          </Link>

          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-2xl border border-slate-300 px-6 py-4 text-lg font-semibold text-slate-700 hover:bg-slate-50"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}