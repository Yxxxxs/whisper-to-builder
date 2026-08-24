/**
 * HOT STUFF PRICING ENGINE
 * ------------------------------------------------------------------
 * Every number a customer sees comes from this file. When blanks.ca or
 * jiffy prices move, edit the numbers here and nothing else.
 *
 * Formula per order:
 *   (landed blanks + print cost + labour) x markup
 *
 * The customer NEVER sees costs, hours, or the markup. Only the range.
 */

export const PRICING = {
  /** Landed blank cost per piece, before tax/shipping (blanks.ca / jiffy list price). */
  garments: {
    budgetTee: { label: "T-shirt — budget", sku: "ATC1000", cost: 2.99 },
    standardTee: { label: "T-shirt — standard", sku: "Gildan 5000", cost: 3.48 },
    longSleeve: { label: "Long sleeve tee", sku: "Gildan 2400", cost: 9.75 },
    hoodie: { label: "Hoodie", sku: "Gildan 18500", cost: 13.49 },
    own: { label: "Your own garments", sku: "customer supplied", cost: 0 },
  },

  /** Cushion on blank cost to absorb 2XL+ and colour variance (sizes aren't asked in the flow). */
  sizeCushion: 1.055,

  /** Ontario HST on the blanks order. */
  taxRate: 0.13,

  /** Blanks shipping: flat fee below the free-shipping threshold. */
  shippingFee: 30,
  freeShippingThreshold: 299,

  /**
   * DTF gang sheet print cost per placement.
   * Sheet is 22.5in wide and costs $7.50 per 12in of length,
   * +8% for gutters and part-used sheets.
   */
  prints: {
    fullFront: { label: "Full front print", cost: 2.0 },
    fullBack: { label: "Full back print", cost: 2.0 },
    leftChest: { label: "Small left chest print", cost: 0.2 },
    sleeve: { label: "Sleeve print", cost: 0.4 },
    personalised: { label: "Personalised name or number", cost: 0.68 },
  },

  /** Labour. Setup scales with order size but flattens out. */
  hourlyRate: 23.5,
  setupMinutes: (qty: number) => 25 + 9 * Math.sqrt(qty),
  minutesPerRepeatPlacement: 2,
  minutesPerPersonalisedPlacement: 6,
  minutesPerGarmentHandling: 1,

  /** Markup slides continuously from small to large orders — no tier cliffs. */
  markupAtSmallQty: 1.5,
  markupAtLargeQty: 1.32,
  markupFlattensAtQty: 100,

  /** Top of the quoted range, as a multiple of the bottom. */
  rangeSpread: 1.12,

  /** Design help widens the range instead of quoting an hourly rate. */
  designWidening: {
    ready: { lowFactor: 1, highFactor: 1 },
    cleanup: { lowFactor: 1.02, highFactor: 1.1 },
    needed: { lowFactor: 1.06, highFactor: 1.28 },
  },

  /** Estimator floor. Below this, people message directly. */
  minimumQuantity: 5,

  /** Print-only on customer-supplied garments, one-off starting point. */
  printOnlyStartsAt: 25,

  turnaroundBusinessDays: 6,
} as const;

export type GarmentKey = keyof typeof PRICING.garments;
export type PlacementKey = "fullFront" | "fullBack" | "leftChest" | "sleeve";
export type ArtworkKey = keyof typeof PRICING.designWidening;

export type EstimateInput = {
  garment: GarmentKey;
  quantity: number;
  placements: PlacementKey[];
  personalised: boolean;
  personalisedCount: number;
  artwork: ArtworkKey;
};

export type SpecLine = { label: string; detail: string; amount: number };

export type Estimate = {
  low: number;
  high: number;
  perPieceLow: number;
  perPieceHigh: number;
  lines: SpecLine[];
};

const round = (n: number) => Math.round(n);

function markupFor(qty: number) {
  const { markupAtSmallQty, markupAtLargeQty, markupFlattensAtQty } = PRICING;
  const t = Math.min(1, Math.max(0, (qty - 1) / (markupFlattensAtQty - 1)));
  return markupAtLargeQty + (markupAtSmallQty - markupAtLargeQty) * (1 - t);
}

export function calculateEstimate(input: EstimateInput): Estimate {
  const qty = Math.max(1, Math.floor(input.quantity || 0));
  const garment = PRICING.garments[input.garment];
  const nameCount = input.personalised
    ? Math.min(qty, Math.max(0, Math.floor(input.personalisedCount || 0)))
    : 0;

  // --- Blanks (landed) ---
  const blanksGoods = garment.cost * PRICING.sizeCushion * qty;
  const shipping =
    blanksGoods > 0 && blanksGoods < PRICING.freeShippingThreshold ? PRICING.shippingFee : 0;
  const blanksLanded = blanksGoods * (1 + PRICING.taxRate) + shipping;

  // --- Prints ---
  const repeatPlacementCost = input.placements.reduce(
    (sum, key) => sum + PRICING.prints[key].cost,
    0,
  );
  const printCost = repeatPlacementCost * qty + PRICING.prints.personalised.cost * nameCount;

  // --- Labour ---
  const minutes =
    PRICING.setupMinutes(qty) +
    input.placements.length * qty * PRICING.minutesPerRepeatPlacement +
    nameCount * PRICING.minutesPerPersonalisedPlacement +
    qty * PRICING.minutesPerGarmentHandling;
  const labour = (minutes / 60) * PRICING.hourlyRate;

  const cost = blanksLanded + printCost + labour;
  const markup = markupFor(qty);
  const design = PRICING.designWidening[input.artwork];

  const low = cost * markup * design.lowFactor;
  const high = cost * markup * PRICING.rangeSpread * design.highFactor;

  // --- Customer-facing spec lines: margin already baked into every line ---
  const lines: SpecLine[] = [];
  const garmentShare = blanksLanded * markup;
  const labourShare = labour * markup;

  if (garment.cost > 0) {
    lines.push({
      label: garment.label,
      detail: `${qty} pieces, sourced and sorted`,
      amount: garmentShare,
    });
  } else {
    lines.push({
      label: "Your own garments",
      detail: `${qty} pieces supplied by you`,
      amount: 0,
    });
  }

  for (const key of input.placements) {
    lines.push({
      label: PRICING.prints[key].label,
      detail: `${qty} placements`,
      amount: PRICING.prints[key].cost * qty * markup,
    });
  }

  if (nameCount > 0) {
    lines.push({
      label: "Personalised names or numbers",
      detail: `${nameCount} individually aligned`,
      amount: PRICING.prints.personalised.cost * nameCount * markup,
    });
  }

  lines.push({
    label: "Setup and production",
    detail: "Artwork prep, gang sheet layout, pressing, packing",
    amount: labourShare,
  });

  if (input.artwork !== "ready") {
    lines.push({
      label: input.artwork === "cleanup" ? "Artwork cleanup" : "Design work",
      detail: "Confirmed once we see what you have",
      amount: 0,
    });
  }

  return {
    low: round(low),
    high: round(high),
    perPieceLow: Math.round((low / qty) * 100) / 100,
    perPieceHigh: Math.round((high / qty) * 100) / 100,
    lines: lines.map((line) => ({ ...line, amount: round(line.amount) })),
  };
}

export const money = (n: number) =>
  `$${n.toLocaleString("en-CA", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

export const moneyPrecise = (n: number) =>
  `$${n.toLocaleString("en-CA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
