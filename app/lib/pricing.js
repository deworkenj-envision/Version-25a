export const pricingConfig = {
  "Business Cards": {
    base: 54,
    quantities: {
      250: 1.0,
      500: 1.35,
      1000: 1.9,
      2500: 3.8,
    },
    paperUpcharges: {
      "14pt Matte": 0,
      "16pt Gloss": 8,
      "16pt Soft Touch": 14,
    },
    finishUpcharges: {
      Matte: 0,
      Gloss: 4,
      "Soft Touch": 10,
      "UV Coated": 12,
    },
    sideUpcharges: {
      "Front Only": 0,
      "Front and Back": 12,
    },
  },

  Flyers: {
    base: 79,
    quantities: {
      250: 1.0,
      500: 1.45,
      1000: 2.1,
      2500: 4.2,
    },
    paperUpcharges: {
      "100lb Gloss Text": 0,
      "100lb Matte Text": 6,
      "14pt Cover": 12,
    },
    finishUpcharges: {
      Gloss: 0,
      Matte: 6,
      "No Coating": -4,
    },
    sideUpcharges: {
      "Front Only": 0,
      "Front and Back": 16,
    },
  },

  Banners: {
    base: 129,
    quantities: {
      1: 1.0,
      2: 1.85,
      5: 4.2,
      10: 7.5,
    },
    paperUpcharges: {
      "13oz Vinyl": 0,
      "15oz Heavy Duty Vinyl": 18,
      "Mesh Banner": 22,
    },
    finishUpcharges: {
      Hemmed: 8,
      Grommets: 10,
      "Pole Pockets": 16,
    },
    sideUpcharges: {
      "Single Sided": 0,
    },
  },

  Postcards: {
    base: 69,
    quantities: {
      250: 1.0,
      500: 1.4,
      1000: 2.0,
      2500: 4.0,
    },
    paperUpcharges: {
      "14pt Matte": 0,
      "16pt Gloss": 8,
      "16pt AQ": 10,
    },
    finishUpcharges: {
      Matte: 0,
      Gloss: 5,
      "AQ Coated": 8,
      "UV Coated": 12,
    },
    sideUpcharges: {
      "Front Only": 0,
      "Front and Back": 14,
    },
  },
};

export function calculatePrice({
  productName,
  quantity,
  paper,
  finish,
  sides,
}) {
  const config = pricingConfig[productName];

  if (!config) {
    return 0;
  }

  const quantityMultiplier =
    config.quantities?.[quantity] ?? 1;

  const paperUpcharge =
    config.paperUpcharges?.[paper] ?? 0;

  const finishUpcharge =
    config.finishUpcharges?.[finish] ?? 0;

  const sideUpcharge =
    config.sideUpcharges?.[sides] ?? 0;

  const total =
    config.base * quantityMultiplier +
    paperUpcharge +
    finishUpcharge +
    sideUpcharge;

  return Math.round(total * 100) / 100;
}