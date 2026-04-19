import Link from "next/link";
import Image from "next/image";

export default function OrderSuccessLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-r from-sky-900 via-blue-800 to-sky-700 text-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center gap-3 text-center">
            <Link href="/" className="inline-flex items-center justify-center">
              <Image
                src="/logo-hero.png"
                alt="EnVision Direct"
                width={240}
                height={80}
                priority
                className="h-auto w-auto max-h-20 object-contain"
              />
            </Link>

            <div>
              <p className="text-xl font-bold tracking-tight sm:text-2xl">
                Order Confirmed
              </p>
              <p className="mt-1 text-sm text-blue-100 sm:text-base">
                Thank you for choosing EnVision Direct.
              </p>
            </div>
          </div>
        </div>
      </div>

      <main>{children}</main>
    </div>
  );
}