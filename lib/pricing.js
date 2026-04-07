export const PRICING = {
  "Business Cards": {
    base: {
      100: 24.99,
      250: 39.99,
      500: 59.99,
      1000: 89.99,
      2500: 169.99,
      5000: 279.99,
    },
    paper: {
      Standard: 0,
      Premium: 8,
      Luxe: 18,
    },
    finish: {
      Matte: 0,
      Gloss: 4,
      SoftTouch: 10,
      Velvet: 14,
    },
    sides: {
      "Front Only": 0,
      "Front and Back": 6,
    },
    shipping: {
      flat: 9.95,
    },
  },

  Flyers: {
    base: {
      100: 49.99,
      250: 79.99,
      500: 119.99,
      1000: 189.99,
      2500: 359.99,
      5000: 649.99,
    },
    paper: {
      Standard: 0,
      Premium: 12,
      Gloss: 18,
    },
    finish: {
      Matte: 0,
      Gloss: 8,
    },
    sides: {
      "Front Only": 0,
      "Front and Back": 14,
    },
    shipping: {
      flat: 14.95,
    },
  },

  Postcards: {
    base: {
      100: 54.99,
      250: 84.99,
      500: 129.99,
      1000: 209.99,
      2500: 389.99,
      5000: 699.99,
    },
    paper: {
      Standard: 0,
      Premium: 10,
      Luxe: 20,
    },
    finish: {
      Matte: 0,
      Gloss: 6,
      UV: 16,
    },
    sides: {
      "Front Only": 0,
      "Front and Back": 12,
    },
    shipping: {
      flat: 12.95,
    },
  },
};

export const PRODUCT_OPTIONS = {
  "Business Cards": {
    quantities: [100, 250, 500, 1000, 2500, 5000],
    papers: ["Standard", "Premium", "Luxe"],
    finishes: ["Matte", "Gloss", "SoftTouch", "Velvet"],
    sides: ["Front Only", "Front and Back"],
  },
  Flyers: {
    quantities: [100, 250, 500, 1000, 2500, 5000],
    papers: ["Standard", "Premium", "Gloss"],
    finishes: ["Matte", "Gloss"],
    sides: ["Front Only", "Front and Back"],
  },
  Postcards: {
    quantities: [100, 250, 500, 1000, 2500, 5000],
    papers: ["Standard", "Premium", "Luxe"],
    finishes: ["Matte", "Gloss", "UV"],
    sides: ["Front Only", "Front and Back"],
  },
};

export function formatPrice(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(value || 0));
}

export function calculatePrice({
  productName,
  quantity,
  paper,
  finish,
  sides,
}) {
  const product = PRICING[productName];

  if (!product) {
    return {
      subtotal: 0,
      shipping: 0,
      total: 0,
    };
  }

  const basePrice = Number(product.base?.[quantity] || 0);
  const paperPrice = Number(product.paper?.[paper] || 0);
  const finishPrice = Number(product.finish?.[finish] || 0);
  const sidesPrice = Number(product.sides?.[sides] || 0);
  const shipping = Number(product.shipping?.flat || 0);

  const subtotal = basePrice + paperPrice + finishPrice + sidesPrice;
  const total = subtotal + shipping;

  return {
    subtotal: Number(subtotal.toFixed(2)),
    shipping: Number(shipping.toFixed(2)),
    total: Number(total.toFixed(2)),
  };
}