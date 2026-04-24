import Link from "next/link";
import { notFound } from "next/navigation";
import { supabaseAdmin } from "../../../../../../lib/supabaseAdmin";

function formatDate(value) {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleString();
  } catch {
    return value;
  }
}

function eventBadgeClasses(eventType) {
  switch (eventType) {
    case "order_created":
      return "bg-gray-100 text-gray-800 border-gray-200";
    case "status_changed":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "tracking_updated":
      return "bg-orange-100 text-orange-800 border-orange-200";
    case "carrier_updated":
      return "bg-purple-100 text-purple-800 border-purple-200";
    case "artwork_attached":
      return "bg-green-100 text-green-800 border-green-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
}

export default async function OrderActivityPage({ params }) {
  const orderId = params?.id;

  const { data: order, error: orderError } = await supabaseAdmin
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .single();

  if (orderError || !order) {
    notFound();
  }

  const { data: activity = [] } = await supabaseAdmin
    .from("order_activity")
    .select("*")
    .eq("order_id", orderId)
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-5xl px-6 py-8">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Fulfillment History</p>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              {order.order_number || "Order"} Activity Log
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Customer: {order.customer_name || "—"} · {order.customer_email || "—"}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              href="/admin/orders"
              className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-100"
            >
              Back to Orders
            </Link>

            <Link
              href={`/admin/orders/${order.id}`}
              className="rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
            >
              Open Order
            </Link>

            <Link
              href={`/track/${order.tracking_token || ""}`}
              target="_blank"
              className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Customer Tracking Page
            </Link>
          </div>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Status
            </div>
            <div className="mt-2 text-lg font-bold text-gray-900">
              {order.status || "—"}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Product
            </div>
            <div className="mt-2 text-lg font-bold text-gray-900">
              {order.product_name || "—"}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Carrier
            </div>
            <div className="mt-2 text-lg font-bold text-gray-900">
              {order.tracking_carrier || order.carrier || "—"}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Tracking
            </div>
            <div className="mt-2 break-all text-sm font-semibold text-gray-900">
              {order.tracking_number || "—"}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-xl font-bold text-gray-900">Activity Timeline</h2>

          {activity.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-8 text-center text-sm text-gray-600">
              No activity has been logged yet for this order.
            </div>
          ) : (
            <div className="space-y-5">
              {activity.map((item, index) => (
                <div key={item.id} className="relative pl-8">
                  <div className="absolute left-0 top-1.5 h-3 w-3 rounded-full bg-black" />
                  {index !== activity.length - 1 ? (
                    <div className="absolute left-[5px] top-5 h-[calc(100%+12px)] w-px bg-gray-300" />
                  ) : null}

                  <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                    <div className="mb-2 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${eventBadgeClasses(
                            item.event_type
                          )}`}
                        >
                          {item.event_type || "activity"}
                        </span>
                        <span className="text-base font-bold text-gray-900">
                          {item.title || "Activity"}
                        </span>
                      </div>

                      <div className="text-sm text-gray-500">
                        {formatDate(item.created_at)}
                      </div>
                    </div>

                    <p className="text-sm text-gray-700">
                      {item.description || "—"}
                    </p>

                    {item.metadata && Object.keys(item.metadata).length > 0 ? (
                      <div className="mt-3 rounded-xl border border-gray-200 bg-white p-3">
                        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                          Details
                        </div>
                        <div className="space-y-1 text-sm text-gray-700">
                          {Object.entries(item.metadata).map(([key, value]) => (
                            <div key={key}>
                              <span className="font-semibold text-gray-900">{key}:</span>{" "}
                              <span>{value === null ? "—" : String(value)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}