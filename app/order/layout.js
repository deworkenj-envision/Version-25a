import Link from "next/link";
import Image from "next/image";

export default function OrderLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-r from-sky-900 via-blue-800 to-sky-700 text-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center gap-3 text-center">
            <Link href="/" className="inline-flex items-center justify-center">
              <Image
                src="/images/logo-hero.png"
                alt="EnVision Direct"
                width={240}
                height={80}
                priority
                className="h-auto w-auto max-h-20 object-contain"
              />
            </Link>

            <div>
              <p className="text-xl font-bold tracking-tight sm:text-2xl">
                Customize Your Order
              </p>
              <p className="mt-1 text-sm text-blue-100 sm:text-base">
                Premium printing. Fast turnaround. Competitive pricing.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs font-medium text-blue-100 sm:text-sm">
              <span className="rounded-full bg-white/10 px-3 py-1">Business Cards</span>
              <span className="rounded-full bg-white/10 px-3 py-1">Postcards</span>
              <span className="rounded-full bg-white/10 px-3 py-1">Flyers</span>
              <span className="rounded-full bg-white/10 px-3 py-1">Banners</span>
            </div>
          </div>
        </div>
      </div>

      <main>{children}</main>
    </div>
  );
}