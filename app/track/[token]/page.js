import Link from "next/link";
import { notFound } from "next/navigation";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";

function formatDate(value) {
  if (!value) return "—";

  try {
    return new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Los_Angeles",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZoneName: "short",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function getTrackingLink(carrier, trackingNumber) {
  if (!trackingNumber) return "";

  const num = encodeURIComponent(trackingNumber.trim());
  const c = (carrier || "").toLowerCase();

  if (c === "ups") return `https://www.ups.com/track?tracknum=${num}`;
  if (c === "usps") return `https://tools.usps.com/go/TrackConfirmAction?tLabels=${num}`;
  if (c === "fedex") return `https://www.fedex.com/fedextrack/?trknbr=${num}`;

  return "";
}

function stepState(currentStatus, step) {
  const order = ["pending", "paid", "printing", "shipped", "delivered"];
  const currentIndex = order.indexOf((currentStatus || "").toLowerCase());
  const stepIndex = order.indexOf(step);

  if (currentIndex > stepIndex) return "Complete";
  if (currentIndex === stepIndex) return "In Progress";
  return "Pending";
}

export default async function SecureTrackingPage({ params }) {
  const resolvedParams = await params;
  const token = resolvedParams?.token;

  if (!token) notFound();

  const { data: order, error } = await supabaseAdmin
    .from("orders")
    .select("*")
    .eq("tracking_token", token)
    .maybeSingle();

  if (error || !order) notFound();

  const carrier = order.tracking_carrier || order.carrier || "";
  const trackingNumber = order.tracking_number || "";
  const trackingUrl =
    order.tracking_url || getTrackingLink(carrier, trackingNumber);

  const status = (order.status || "pending").toLowerCase();

  const steps = [
    ["paid", "Order Received"],
    ["printing", "Printing"],
    ["shipped", "Shipped"],
    ["delivered", "Delivered"],
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <section className="mb-8 rounded-[32px] border border-white/10 bg-slate-900 p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-300">
            EnVision Direct
          </p>

          <h1 className="mt-3 text-4xl font-bold">
            {order.order_number || "Your Order"}
          </h1>

          <p className="mt-3 text-slate-300">
            Current status:{" "}
            <span className="font-bold capitalize text-white">{status}</span>
          </p>
        </section>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-[32px] border border-white/10 bg-slate-900 p-6">
            <h2 className="mb-5 text-2xl font-bold">Order Progress</h2>

            <div className="space-y-4">
              {steps.map(([step, label]) => {
                const state = stepState(status, step);

                return (
                  <div
                    key={step}
                    className="rounded-2xl border border-white/10 bg-slate-800 p-5"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-bold">{label}</h3>
                        <p className="mt-1 text-sm text-slate-300">{state}</p>
                      </div>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          state === "Complete"
                            ? "bg-emerald-400 text-slate-950"
                            : state === "In Progress"
                            ? "bg-cyan-300 text-slate-950"
                            : "bg-slate-700 text-slate-300"
                        }`}
                      >
                        {state}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <aside className="space-y-6">
            <section className="rounded-[32px] border border-white/10 bg-slate-900 p-6">
              <h2 className="text-2xl font-bold">Shipping Details</h2>

              <div className="mt-5 space-y-4">
                <p>
                  <span className="text-slate-400">Carrier:</span>{" "}
                  <strong>{carrier || "Not available yet"}</strong>
                </p>

                <p className="break-all">
                  <span className="text-slate-400">Tracking Number:</span>{" "}
                  <strong>{trackingNumber || "Not available yet"}</strong>
                </p>

                {trackingUrl ? (
                  <a
                    href={trackingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex w-full justify-center rounded-xl bg-cyan-400 px-5 py-3 text-sm font-black text-slate-950"
                  >
                    Open Carrier Tracking
                  </a>
                ) : null}
              </div>
            </section>

            <section className="rounded-[32px] border border-white/10 bg-slate-900 p-6">
              <h2 className="text-2xl font-bold">Order Summary</h2>

              <div className="mt-5 space-y-3 text-sm">
                <p>Product: {order.product_name || "—"}</p>
                <p>Size: {order.size || "—"}</p>
                <p>Quantity: {order.quantity || "—"}</p>
                <p>Created: {formatDate(order.created_at)}</p>
              </div>
            </section>
          </aside>
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="text-sm font-semibold text-cyan-300">
            Back to EnVision Direct
          </Link>
        </div>
      </div>
    </main>
  );
}