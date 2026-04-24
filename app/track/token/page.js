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
  const normalizedCarrier = (carrier || "").toLowerCase();

  if (normalizedCarrier === "ups") {
    return `https://www.ups.com/track?tracknum=${num}`;
  }

  if (normalizedCarrier === "fedex") {
    return `https://www.fedex.com/fedextrack/?trknbr=${num}`;
  }

  if (normalizedCarrier === "usps") {
    return `https://tools.usps.com/go/TrackConfirmAction?tLabels=${num}`;
  }

  return "";
}

function getStepState(currentStatus, stepStatus) {
  const order = ["pending", "paid", "printing", "shipped", "delivered"];
  const currentIndex = order.indexOf((currentStatus || "").toLowerCase());
  const stepIndex = order.indexOf(stepStatus);

  if (currentIndex > stepIndex) return "complete";
  if (currentIndex === stepIndex) return "current";
  return "upcoming";
}

function TimelineStep({ title, description, state }) {
  const styles = {
    complete: {
      dot: "bg-emerald-400 text-slate-950",
      card: "border-emerald-400/30 bg-emerald-400/10",
      label: "Complete",
      labelClass: "bg-emerald-400 text-slate-950",
    },
    current: {
      dot: "bg-cyan-300 text-slate-950",
      card: "border-cyan-300/40 bg-cyan-300/10",
      label: "In Progress",
      labelClass: "bg-cyan-300 text-slate-950",
    },
    upcoming: {
      dot: "bg-slate-700 text-slate-300",
      card: "border-white/10 bg-slate-800/70",
      label: "Pending",
      labelClass: "bg-slate-700 text-slate-300",
    },
  };

  const s = styles[state] || styles.upcoming;

  return (
    <div className={`rounded-2xl border p-5 ${s.card}`}>
      <div className="flex items-start gap-4">
        <div
          className={`mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-black ${s.dot}`}
        >
          {state === "complete" ? "✓" : state === "current" ? "•" : "○"}
        </div>

        <div className="flex-1">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-lg font-bold text-white">{title}</h3>
            <span
              className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] ${s.labelClass}`}
            >
              {s.label}
            </span>
          </div>

          <p className="mt-2 text-sm leading-6 text-slate-300">{description}</p>
        </div>
      </div>
    </div>
  );
}

export default async function SecureTrackPage({ params }) {
  const resolvedParams = await params;
  const token = resolvedParams?.token;

  if (!token) {
    notFound();
  }

  const { data: order, error } = await supabaseAdmin
    .from("orders")
    .select("*")
    .eq("tracking_token", token)
    .maybeSingle();

  if (error || !order) {
    notFound();
  }

  const carrier = order.tracking_carrier || order.carrier || "";
  const trackingNumber = order.tracking_number || "";
  const trackingLink = order.tracking_url || getTrackingLink(carrier, trackingNumber);

  const status = (order.status || "pending").toLowerCase();

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <section className="mb-8 rounded-[32px] border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 p-8 shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-xl font-black text-slate-950">
                  EV
                </div>

                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.26em] text-cyan-300">
                    EnVision Direct
                  </p>
                  <p className="text-sm text-slate-300">Order Tracking</p>
                </div>
              </div>

              <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
                {order.order_number || "Your Order"}
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300">
                Track your print order from production through delivery. All order
                updates are shown in Pacific Time.
              </p>
            </div>

            <div className="rounded-2xl border border-cyan-300/30 bg-cyan-300/10 px-5 py-4 text-center">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-200">
                Current Status
              </p>
              <p className="mt-2 text-2xl font-black capitalize text-white">
                {status || "pending"}
              </p>
            </div>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <section className="rounded-[32px] border border-white/10 bg-slate-900 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.3)]">
            <h2 className="mb-5 text-2xl font-bold">Order Progress</h2>

            <div className="space-y-4">
              <TimelineStep
                title="Order Received"
                description="Your order has been received and entered into our production system."
                state={getStepState(status, "paid")}
              />

              <TimelineStep
                title="Printing"
                description="Your artwork and order details are being prepared for production."
                state={getStepState(status, "printing")}
              />

              <TimelineStep
                title="Shipped"
                description="Your order has shipped. Tracking information will appear here when available."
                state={getStepState(status, "shipped")}
              />

              <TimelineStep
                title="Delivered"
                description="Your order has been delivered."
                state={getStepState(status, "delivered")}
              />
            </div>
          </section>

          <aside className="space-y-6">
            <section className="rounded-[32px] border border-white/10 bg-slate-900 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.3)]">
              <h2 className="text-2xl font-bold">Shipping Details</h2>

              <div className="mt-5 space-y-4">
                <div className="rounded-2xl border border-white/10 bg-slate-800 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                    Carrier
                  </p>
                  <p className="mt-2 text-lg font-bold text-white">
                    {carrier || "Not available yet"}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-slate-800 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                    Tracking Number
                  </p>
                  <p className="mt-2 break-all text-lg font-bold text-white">
                    {trackingNumber || "Not available yet"}
                  </p>
                </div>

                {trackingLink ? (
                  <a
                    href={trackingLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex w-full items-center justify-center rounded-xl bg-cyan-400 px-5 py-3 text-sm font-black text-slate-950 transition hover:opacity-90"
                  >
                    Open Carrier Tracking
                  </a>
                ) : (
                  <div className="rounded-2xl border border-white/10 bg-slate-800 p-4 text-sm leading-6 text-slate-300">
                    Carrier tracking will appear here once your order ships.
                  </div>
                )}
              </div>
            </section>

            <section className="rounded-[32px] border border-white/10 bg-slate-900 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.3)]">
              <h2 className="text-2xl font-bold">Order Summary</h2>

              <div className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between gap-4 border-b border-white/10 pb-3">
                  <span className="text-slate-400">Product</span>
                  <span className="font-semibold text-white">
                    {order.product_name || "—"}
                  </span>
                </div>

                <div className="flex justify-between gap-4 border-b border-white/10 pb-3">
                  <span className="text-slate-400">Size</span>
                  <span className="font-semibold text-white">
                    {order.size || "—"}
                  </span>
                </div>

                <div className="flex justify-between gap-4 border-b border-white/10 pb-3">
                  <span className="text-slate-400">Quantity</span>
                  <span className="font-semibold text-white">
                    {order.quantity || "—"}
                  </span>
                </div>

                <div className="flex justify-between gap-4 border-b border-white/10 pb-3">
                  <span className="text-slate-400">Created</span>
                  <span className="text-right font-semibold text-white">
                    {formatDate(order.created_at)}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-slate-400">Customer</span>
                  <span className="text-right font-semibold text-white">
                    {order.customer_name || "—"}
                  </span>
                </div>
              </div>
            </section>
          </aside>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-sm font-semibold text-cyan-300 hover:text-cyan-200"
          >
            Back to EnVision Direct
          </Link>
        </div>
      </div>
    </main>
  );
}