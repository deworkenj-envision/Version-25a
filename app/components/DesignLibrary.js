'use client';

import { useEffect, useState } from 'react';

export default function DesignLibrary() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const current = JSON.parse(localStorage.getItem('printluxe-designs') || '[]');
    setItems(current);
  }, []);

  function clearAll() {
    localStorage.removeItem('printluxe-designs');
    setItems([]);
  }

  return (
    <div className="panel">
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>Saved Designs</h2>
        <button className="btn btn-secondary" onClick={clearAll}>Clear demo library</button>
      </div>
      {items.length === 0 ? (
        <p className="muted">No local demo designs yet. Save one from the Designer page and it will appear here.</p>
      ) : (
        <table className="table">
          <thead>
            <tr><th>Product</th><th>Headline</th><th>Saved</th></tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.product}</td>
                <td>{item.headline}</td>
                <td>{new Date(item.savedAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
