import PricingCalculator from '../components/PricingCalculator';

export default function PricingPage() {
  return (
    <main className="section">
      <div className="container">
        <h1 className="section-title">Pricing Calculator</h1>
        <p className="section-subtitle">This screen is fully populated and interactive in the preview build.</p>
        <PricingCalculator />
      </div>
    </main>
  );
}
