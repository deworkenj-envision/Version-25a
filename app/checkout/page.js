function toNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function formatMoney(value) {
  return toNumber(value).toFixed(2);
}

export default async function CheckoutPage({ searchParams }) {
  const params = await searchParams;

  const productName = params?.productName || "Business Cards";
  const quantity = params?.quantity || "100";
  const size = params?.size || "—";
  const paper = params?.paper || "Standard";
  const finish = params?.finish || "Matte";
  const sides = params?.sides || "Front Only";

  const customerName = params?.customerName || "";
  const customerEmail = params?.customerEmail || "";
  const notes = params?.notes || "";

  const artworkUrl = params?.artworkUrl || "";
  const fileName = params?.fileName || "";

  const productImage = params?.productImage || "";

  const subtotal = toNumber(params?.subtotal);
  const shipping = 12.95; // keep consistent with order page
  const total = subtotal + shipping;

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-slate-900">Checkout</h1>
          <p className="mt-3 text-slate-600">
            Review your order details before payment.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          {/* LEFT */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-900">
              Order details
            </h2>

            {/* PRODUCT IMAGE */}
            {productImage && (
              <div className="mt-6 overflow-hidden rounded-xl">
                <img
                  src={productImage}
                  alt={productName}
                  className="h-40 w-full object-cover"
                />
              </div>
            )}

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Product</p>
                <p className="mt-1 font-semibold text-slate-900">{productName}</p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Quantity</p>
                <p className="mt-1 font-semibold text-slate-900">{quantity}</p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Size</p>
                <p className="mt-1 font-semibold text-slate-900">{size}</p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Paper</p>
                <p className="mt-1 font-semibold text-slate-900">{paper}</p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Finish</p>
                <p className="mt-1 font-semibold text-slate-900">{finish}</p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4 sm:col-span-2">
                <p className="text-sm text-slate-500">Sides</p>
                <p className="mt-1 font-semibold text-slate-900">{sides}</p>
              </div>
            </div>

            <h3 className="mt-8 text-xl font-semibold text-slate-900">
              Customer information
            </h3>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Name</p>
                <p className="mt-1 font-semibold text-slate-900">
                  {customerName || "—"}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Email</p>
                <p className="mt-1 font-semibold text-slate-900">
                  {customerEmail || "—"}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4 sm:col-span-2">
                <p className="text-sm text-slate-500">Notes</p>
                <p className="mt-1 font-semibold text-slate-900">
                  {notes || "—"}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4 sm:col-span-2">
                <p className="text-sm text-slate-500">Artwork</p>
                {artworkUrl ? (
                  <a
                    href={artworkUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 inline-block font-semibold text-blue-600 hover:underline"
                  >
                    {fileName || "View uploaded artwork"}
                  </a>
                ) : (
                  <p className="mt-1 font-semibold text-slate-900">
                    No file uploaded
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* RIGHT */}
          <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-900">
              Pricing summary
            </h2>

            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Subtotal</span>
                <span className="font-medium text-slate-900">
                  ${formatMoney(subtotal)}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Shipping</span>
                <span className="font-medium text-slate-900">
                  ${formatMoney(shipping)}
                </span>
              </div>

              <div className="border-t border-slate-200 pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-base font-semibold text-slate-900">
                    Total
                  </span>
                  <span className="text-2xl font-bold text-slate-900">
                    ${formatMoney(total)}
                  </span>
                </div>
              </div>
            </div>

            <a
              href="/order"
              className="mt-6 block w-full rounded-xl bg-blue-600 px-4 py-4 text-center text-base font-semibold text-white transition hover:bg-blue-700"
            >
              Back to Order
            </a>
          </aside>
        </div>
      </div>
    </main>
  );
}