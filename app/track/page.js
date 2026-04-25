import { redirect } from "next/navigation";

export default function TrackPage({ searchParams }) {
  const token = searchParams?.token;

  // 🔥 CRITICAL: if token exists → redirect to working page
  if (token) {
    redirect(`/track/${token}`);
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-5xl items-center justify-center px-6 py-12">
        <div className="w-full rounded-[32px] border border-white/10 bg-slate-900 p-8 text-center">
          <h1 className="text-3xl font-bold mb-4">Track Your Order</h1>
          <p className="text-slate-300">
            Please use the secure tracking link from your email.
          </p>
        </div>
      </div>
    </main>
  );
}