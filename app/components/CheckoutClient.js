'use client';

import { useMemo, useState } from 'react';
import { calculatePrice } from '../../lib/pricing';

export default function CheckoutClient() {
  const [customer, setCustomer] = useState('John Demo');
  const [email, setEmail] = useState('john@envisiondirect.net');
  const [product, setProduct] = useState('Business Cards');
  const [quantity, setQuantity] = useState(250);
  const [finish, setFinish] = useState('Matte');
  const [notes, setNotes] = useState('Use saved design concept A.');
  const [state, setState] = useState('idle');

  const total = useMemo(() => calculatePrice({ product, quantity: Number(quantity), finish, rush: false }), [product, quantity, finish]);

  async function startCheckout() {
    setState('loading');
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customer, email, product, quantity: Number(quantity), finish, notes, total })
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.message || 'Demo checkout created.');
        setState('done');
      }
    } catch (error) {
      alert('Checkout failed in demo mode.');
      setState('error');
    }
  }

  return (
    <div className="grid grid-2">
      <div className="panel">
        <div className="form-grid">
          <label className="field"><span>Name</span><input value={customer} onChange={(e) => setCustomer(e.target.value)} /></label>
          <label className="field"><span>Email</span><input value={email} onChange={(e) => setEmail(e.target.value)} /></label>
          <label className="field"><span>Product</span>
            <select value={product} onChange={(e) => setProduct(e.target.value)}>
              {['Business Cards', 'Flyers', 'Postcards', 'Banners'].map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <label className="field"><span>Quantity</span><input type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} /></label>
          <label className="field"><span>Finish</span>
            <select value={finish} onChange={(e) => setFinish(e.target.value)}>
              {['Matte', 'Gloss', 'Soft Touch', 'Premium Heavy Stock'].map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <label className="field" style={{ gridColumn: '1 / -1' }}><span>Production notes</span><textarea rows="4" value={notes} onChange={(e) => setNotes(e.target.value)} /></label>
        </div>
      </div>
      <div className="panel">
        <h2 style={{ marginTop: 0 }}>Order Summary</h2>
        <table className="table">
          <tbody>
            <tr><th>Item</th><td>{product}</td></tr>
            <tr><th>Quantity</th><td>{quantity}</td></tr>
            <tr><th>Finish</th><td>{finish}</td></tr>
            <tr><th>Estimated total</th><td>${total.toFixed(2)}</td></tr>
            <tr><th>Mode</th><td>{process.env.NEXT_PUBLIC_APP_URL ? 'Ready for Stripe setup' : 'Demo local mode'}</td></tr>
          </tbody>
        </table>
        <div style={{ display: 'flex', gap: 12, marginTop: 16, flexWrap: 'wrap' }}>
          <button className="btn btn-primary" disabled={state === 'loading'} onClick={startCheckout}>
            {state === 'loading' ? 'Starting checkout...' : 'Pay with Stripe'}
          </button>
          <a className="btn btn-secondary" href="/dashboard">Review dashboard</a>
        </div>
      </div>
    </div>
  );
}
