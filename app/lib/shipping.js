export function calculateShipping({ productName, quantity }) {
  const qty = Number(quantity) || 0;

  if (productName === "Business Cards") {
    if (qty <= 250) return 9.95;
    if (qty <= 500) return 12.95;
    if (qty <= 1000) return 16.95;
    return 24.95;
  }

  if (productName === "Flyers") {
    if (qty <= 250) return 11.95;
    if (qty <= 500) return 15.95;
    if (qty <= 1000) return 21.95;
    return 29.95;
  }

  if (productName === "Postcards") {
    if (qty <= 250) return 10.95;
    if (qty <= 500) return 14.95;
    if (qty <= 1000) return 19.95;
    return 27.95;
  }

  if (productName === "Banners") {
    if (qty <= 1) return 18.95;
    if (qty <= 2) return 26.95;
    if (qty <= 5) return 39.95;
    return 59.95;
  }

  return 12.95;
}