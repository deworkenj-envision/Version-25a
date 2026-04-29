import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Business Cards Printing Online | EnVision Direct",
  description:
    "Order professional business cards online from EnVision Direct. Premium paper options, fast turnaround, easy artwork upload, secure checkout, and competitive pricing.",
};

export default function BusinessCardsPrintingPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="bg-gradient-to-r from-blue-700 via-blue-600 to-sky-500 text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-16 md:px-10 lg:grid-cols-2">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-blue-100">
              Business Cards Printing
            </p>

            <h1 className="mt-4 text-4xl font-extrabold leading-tight md:text-6xl">
              Professional Business Cards Printed Fast
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-blue-100">
              Create a polished first impression with high-quality business card
              printing. Upload your artwork, choose your options, and order
              securely online.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/order?product=Business%20Cards"
                className="inline-flex items-center justify-center rounded-2xl bg-white px-9 py-5 text-lg font-extrabold text-blue-700 shadow-xl transition hover:scale-[1.02] hover:bg-slate-100"
              >
                Order Business Cards
              </Link>

              <Link
                href="/track"
                className="inline-flex items-center justify-center rounded-2xl border border-white/40 bg-white/10 px-8 py-5 text-lg font-bold text-white transition hover:bg-white/20"
              >
                Track Your Order
              </Link>
            </div>
          </div>

          <div className="rounded-[28px] bg-white/95 p-5 shadow-2xl">
            <Image
              src="/products/business-cards.jpg"
              alt="Business cards printing"
              width={800}
              height={600}
              className="h-auto w-full rounded-[22px] object-cover"
              priority
            />
          </div>
        </div>
      </section>

      <section className="bg-[#f5f5f7]">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-10">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-3xl bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-bold">Premium Quality</h2>
              <p className="mt-3 text-slate-600">
                Business cards printed with sharp detail, clean color, and a
                professional finish.
              </p>
            </div>

            <div className="rounded-3xl bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-bold">Easy Online Ordering</h2>
              <p className="mt-3 text-slate-600">
                Choose your size, paper, finish, sides, and quantity with live
                pricing before checkout.
              </p>
            </div>

            <div className="rounded-3xl bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-bold">Fast Turnaround</h2>
              <p className="mt-3 text-slate-600">
                Upload your print-ready artwork and place your order online in
                minutes.
              </p>
            </div>
          </div>

          <div className="mt-14 rounded-[30px] bg-white p-8 shadow-sm md:p-10">
            <h2 className="text-3xl font-extrabold tracking-tight">
              Business Card Printing Made Simple
            </h2>

            <p className="mt-5 max-w-4xl text-lg leading-8 text-slate-600">
              EnVision Direct makes it easy to order business cards online.
              Whether you need cards for networking, sales teams, events, or
              brand promotion, you can upload your artwork, select your print
              options, and complete checkout securely.
            </p>

            <div className="mt-8">
              <Link
                href="/order?product=Business%20Cards"
                className="inline-flex items-center justify-center rounded-2xl bg-blue-700 px-9 py-5 text-lg font-extrabold text-white shadow-xl transition hover:bg-blue-800"
              >
                Start Your Business Card Order →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

<div className="mt-12 border-t pt-8">
  <h3 className="mb-4 text-lg font-semibold">
    Explore Other Printing Products
  </h3>

  <div className="flex flex-wrap gap-4">
    <a href="/postcards" className="text-blue-600 hover:underline">
      Postcards
    </a>
    <a href="/flyers" className="text-blue-600 hover:underline">
      Flyers
    </a>
    <a href="/banners" className="text-blue-600 hover:underline">
      Banners
    </a>
  </div>
</div>