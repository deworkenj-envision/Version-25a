const basePricing = {
  'Business Cards': { base: 24, unit: 0.12 },
  Flyers: { base: 34, unit: 0.18 },
  Postcards: { base: 29, unit: 0.16 },
  Banners: { base: 79, unit: 8.5 }
};

export function calculatePrice({ product = 'Business Cards', quantity = 100, finish = 'Matte', rush = false }) {
  const config = basePricing[product] || basePricing['Business Cards'];
  const qtyFactor = product === 'Banners' ? Math.max(1, quantity / 1) : Math.max(1, quantity / 100);
  let total = config.base + config.unit * quantity;

  if (finish === 'Gloss') total += 8;
  if (finish === 'Soft Touch') total += 12;
  if (finish === 'Premium Heavy Stock') total += 16;
  if (rush) total *= 1.2;

  return Math.round(total * 100) / 100;
}
