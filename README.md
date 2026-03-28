# PrintLuxe V25 Real Full

A stable, deployable Next.js build with populated screens and optional Supabase + Stripe wiring.

## Routes
- `/` home
- `/products`
- `/pricing`
- `/designer`
- `/checkout`
- `/dashboard`
- `/admin`
- `/login`

## Run locally
```bash
npm install
npm run dev
```

## Notes
- The app works without environment variables using local demo data.
- If you add Stripe keys, `/api/checkout` will create a real Checkout Session.
- If you add Supabase keys, the helper in `lib/supabase.js` is ready for expansion.
