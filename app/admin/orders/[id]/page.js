import Link from "next/link";
import { supabaseAdmin } from "../../../../lib/supabaseAdmin";

export const dynamic = "force-dynamic";

function formatMoney(value) {
  return `$${Number(value || 0).toFixed(2)}`;
}

function formatDate(value) {
  if (!value) return "-";
  try {
    return new Date(value).toLocaleString();
  } catch {
    return value;
  }
}

function buildAddress(order) {
  return [
    order.shipping_name,
    order.shipping_address_line1,
    order.shipping_address_line2,
    `${order.shipping_city || ""}${order.shipping_city && (order.shipping_state || order.shipping_postal_code) ? ", " : ""}${order.shipping_state || ""} ${order.shipping_postal_code || ""}`.trim(),
    order.shipping_country,
  ]
    .filter(Boolean)
    .join("\n");
}

async function getOrder(id) {
  const { data, error } = await supabaseAdmin
    .from("orders")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Failed to load order:", error);
    return null;
  }

  return data;
}

export default async function AdminOrderPrintPage({ params }) {
  const resolvedParams = await params;
  const orderId = resolvedParams?.id || "";
  const order = await getOrder(orderId);

  if (!order) {
    return (
      <main className="min-h-screen bg-slate-100 px-6 py-10">
        <div className="mx-auto max-w-5xl rounded-3xl bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-slate-900">Order Not Found</h1>
          <p className="mt-3 text-slate-600">
            We could not load this order.
          </p>
          <Link
            href="/admin/orders"
            className="mt-6 inline-flex rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white"
          >
            Back to Admin Orders
          </Link>
        </div>
      </main>
    );
  }

  const shippingAddress = buildAddress(order);

  return (
    <main className="min-h-screen bg-slate-100 px-6 py-10 print:bg-white print:px-0 print:py-0">
      <div className="mx-auto max-w-5xl rounded-3xl bg-white shadow-sm print:max-w-none print:rounded-none print:shadow-none">
        <div className="border-b border-slate-200 px-8 py-6 print:hidden">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Fulfillment Sheet
              </h1>
              <p className="mt-1 text-slate-600">
                Print-ready order summary for production and shipping.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => window.print()}
                className="rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white hover:bg-slate-800"
              >
                Print / Save PDF
              </button>

              <Link
                href="/admin/orders"
                className="rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50"
              >
                Back to Orders
              </Link>
            </div>
          </div>
        </div>

        <div className="px-8 py-8">
          <div className="mb-8 flex items-start justify-between gap-6 border-b border-slate-200 pb-6">
            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                EnVision Direct
              </div>
              <h2 className="mt-2 text-4xl font-bold text-slate-950">
                Order #{order.order_number || order.id}
              </h2>
              <p className="mt-2 text-slate-600">
                Created: {formatDate(order.created_at)}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-900 px-5 py-4 text-right text-white">
              <div className="text-xs uppercase tracking-wide text-slate-300">
                Status
              </div>
              <div className="mt-1 text-2xl font-bold uppercase">
                {order.status || "paid"}
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <section className="rounded-2xl border border-slate-200 p-5">
              <h3 className="text-lg font-bold text-slate-900">Customer</h3>
              <div className="mt-4 space-y-3 text-sm">
                <div>
                  <div className="text-slate-500">Name</div>
                  <div className="font-semibold text-slate-900">
                    {order.customer_name || "-"}
                  </div>
                </div>

                <div>
                  <div className="text-slate-500">Email</div>
                  <div className="font-semibold text-slate-900 break-all">
                    {order.customer_email || "-"}
                  </div>
                </div>

                <div>
                  <div className="text-slate-500">Phone</div>
                  <div className="font-semibold text-slate-900">
                    {order.customer_phone || "-"}
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 p-5">
              <h3 className="text-lg font-bold text-slate-900">Ship To</h3>
              <div className="mt-4 whitespace-pre-line text-sm font-semibold text-slate-900">
                {shippingAddress || "-"}
              </div>
            </section>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <section className="rounded-2xl border border-slate-200 p-5">
              <h3 className="text-lg font-bold text-slate-900">Product Specs</h3>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 text-sm">
                <Spec label="Product" value={order.product_name} />
                <Spec label="Quantity" value={order.quantity} />
                <Spec label="Size" value={order.size} />
                <Spec label="Paper" value={order.paper} />
                <Spec label="Finish" value={order.finish} />
                <Spec label="Sides" value={order.sides} />
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 p-5">
              <h3 className="text-lg font-bold text-slate-900">Pricing</h3>
              <div className="mt-4 space-y-3 text-sm">
                <PriceRow label="Subtotal" value={formatMoney(order.subtotal)} />
                <PriceRow label="Shipping" value={formatMoney(order.shipping)} />
                <div className="border-t border-slate-200 pt-3">
                  <PriceRow
                    label="Total"
                    value={formatMoney(order.total)}
                    bold
                  />
                </div>
              </div>
            </section>
          </div>

          <section className="mt-6 rounded-2xl border border-slate-200 p-5">
            <h3 className="text-lg font-bold text-slate-900">Artwork</h3>

            <div className="mt-4 space-y-3 text-sm">
              <div>
                <div className="text-slate-500">File Name</div>
                <div className="font-semibold text-slate-900 break-all">
                  {order.file_name || "-"}
                </div>
              </div>

              <div className="flex flex-wrap gap-3 print:hidden">
                {order.artwork_url ? (
                  <a
                    href={order.artwork_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex rounded-xl bg-green-600 px-4 py-3 font-semibold text-white hover:bg-green-700"
                  >
                    Open Artwork
                  </a>
                ) : (
                  <span className="font-semibold text-slate-900">No artwork</span>
                )}
              </div>

              {order.artwork_url ? (
                <div className="hidden print:block break-all text-slate-900">
                  {order.artwork_url}
                </div>
              ) : null}
            </div>
          </section>

          <section className="mt-6 rounded-2xl border border-slate-200 p-5">
            <h3 className="text-lg font-bold text-slate-900">Notes</h3>
            <div className="mt-4 min-h-[80px] whitespace-pre-wrap text-sm text-slate-900">
              {order.notes || "-"}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function Spec({ label, value }) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <div className="text-slate-500">{label}</div>
      <div className="mt-1 font-semibold text-slate-900">{value || "-"}</div>
    </div>
  );
}

function PriceRow({ label, value, bold = false }) {
  return (
    <div className="flex items-center justify-between">
      <span className={bold ? "font-semibold text-slate-900" : "text-slate-500"}>
        {label}
      </span>
      <span className={bold ? "text-lg font-bold text-slate-900" : "font-semibold text-slate-900"}>
        {value}
      </span>
    </div>
  );
}