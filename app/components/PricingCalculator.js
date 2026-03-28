'use client';

import { useMemo, useState } from 'react';
import { calculatePrice } from '../../lib/pricing';

export default function PricingCalculator() {
  const [product, setProduct] = useState('Business Cards');
  const [quantity, setQuantity] = useState(250);
  const [finish, setFinish] = useState('Matte');
  const [rush, setRush] = useState(false);

  const total = useMemo(() => calculatePrice({ product, quantity: Number(quantity), finish, rush }), [product, quantity, finish, rush]);
  const perUnit = (total / Math.max(1, Number(quantity))).toFixed(2);

  return (
    <div className="panel">
      <div className="form-grid">
        <label className="field">
          <span>Product</span>
          <select value={product} onChange={(e) => setProduct(e.target.value)}>
            {['Business Cards', 'Flyers', 'Postcards', 'Banners'].map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <label className="field">
          <span>Quantity</span>
          <input type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
        </label>
        <label className="field">
          <span>Finish</span>
          <select value={finish} onChange={(e) => setFinish(e.target.value)}>
            {['Matte', 'Gloss', 'Soft Touch', 'Premium Heavy Stock'].map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <label className="field">
          <span>Rush production</span>
          <select value={rush ? 'Yes' : 'No'} onChange={(e) => setRush(e.target.value === 'Yes')}>
            <option>No</option>
            <option>Yes</option>
          </select>
        </label>
      </div>
      <hr className="sep" />
      <div className="grid grid-3">
        <div className="metric"><strong>${total.toFixed(2)}</strong><span className="muted">Estimated total</span></div>
        <div className="metric"><strong>${perUnit}</strong><span className="muted">Per unit</span></div>
        <div className="metric"><strong>2–5 days</strong><span className="muted">Typical turnaround</span></div>
      </div>
    </div>
  );
}
