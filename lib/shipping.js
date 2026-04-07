export function calculateShipping(productName, quantity = 1) {
  const product = String(productName || "").toLowerCase();
  const qty = Number(quantity) || 1;

  let baseShipping = 9.95;

  if (product.includes("business card")) {
    baseShipping = 9.95;
  } else if (product.includes("flyer")) {
    baseShipping = 14.95;
  } else if (product.includes("postcard")) {
    baseShipping = 12.95;
  } else if (product.includes("brochure")) {
    baseShipping = 16.95;
  } else if (product.includes("banner")) {
    baseShipping = 24.95;
  }

  // optional small quantity scaling
  if (qty > 1000 && qty <= 5000) {
    baseShipping += 5;
  } else if (qty > 5000) {
    baseShipping += 10;
  }

  return Number(baseShipping.toFixed(2));
}