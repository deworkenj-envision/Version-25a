export const products = [
  {
    slug: 'business-cards',
    name: 'Business Cards',
    priceFrom: 39,
    turnaround: '2-4 business days',
    sizes: ['3.5 x 2 in'],
    description: 'Premium cards with matte, silk, gloss, or soft-touch finishes.',
    features: ['16pt and 18pt stocks', 'Rounded corners available', 'Front / back printing']
  },
  {
    slug: 'flyers',
    name: 'Flyers',
    priceFrom: 89,
    turnaround: '3-5 business days',
    sizes: ['5.5 x 8.5 in', '8.5 x 11 in'],
    description: 'High-impact flyers for events, menus, retail promos, and launches.',
    features: ['Silk or gloss coating', 'Single or double sided', 'Bulk quantity pricing']
  },
  {
    slug: 'postcards',
    name: 'Postcards',
    priceFrom: 74,
    turnaround: '3-5 business days',
    sizes: ['4 x 6 in', '5 x 7 in'],
    description: 'Mail-ready postcards with bold color and thick premium stocks.',
    features: ['EDDM-ready sizing', 'Writable backs', 'Bulk mail campaign friendly']
  },
  {
    slug: 'banners',
    name: 'Vinyl Banners',
    priceFrom: 129,
    turnaround: '4-6 business days',
    sizes: ['2 x 4 ft', '3 x 6 ft', 'Custom'],
    description: 'Durable indoor/outdoor banners for events, storefronts, and promotions.',
    features: ['Hem & grommets', 'Indoor/outdoor material', 'Full-color printing']
  }
];

export const mockOrders = [
  { id: 'ORD-2501', customer: 'John Demo', product: 'Business Cards', total: 84, status: 'Proofing', placedAt: '2026-03-22' },
  { id: 'ORD-2502', customer: 'Sarah Bloom', product: 'Flyers', total: 149, status: 'Printing', placedAt: '2026-03-24' },
  { id: 'ORD-2503', customer: 'Alex North', product: 'Banner', total: 189, status: 'Shipped', placedAt: '2026-03-26' }
];

export const dashboardMetrics = [
  { label: 'Saved Designs', value: '12' },
  { label: 'Open Orders', value: '3' },
  { label: 'Quotes This Month', value: '18' },
  { label: 'Repeat Customers', value: '41%' }
];
