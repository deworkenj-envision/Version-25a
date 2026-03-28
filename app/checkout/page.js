import CheckoutClient from '../components/CheckoutClient';

export default function CheckoutPage() {
  return (
    <main className="section">
      <div className="container">
        <h1 className="section-title">Checkout</h1>
        <p className="section-subtitle">This screen is populated with a complete order summary and Stripe-ready checkout action.</p>
        <CheckoutClient />
      </div>
    </main>
  );
}
