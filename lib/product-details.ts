export type ProductFacts = {
  features: string[];
  brewingAndStorage: string;
};

type CatalogFacts = {
  ingredients: string;
  bagCount?: number;
  netWeightG?: number;
  flavour: string;
  brewingAndStorage: string;
};

const TEA_BAG_BREWING =
  'Steep 1 tea bag in a cup of freshly boiled water for 3–5 minutes. Drink it hot, or let it cool and pour over ice. Keep the pack sealed in a cool, dry place away from sunlight and strong smells so the leaves stay fresh.';

const CATALOG: Record<string, CatalogFacts> = {
  'soursop-brew': {
    ingredients: '100% soursop leaves',
    bagCount: 50,
    netWeightG: 55,
    flavour: 'Calm, gentle, slightly earthy — pure soursop leaf',
    brewingAndStorage: TEA_BAG_BREWING,
  },
  'guava-green-brew': {
    ingredients: 'Guava leaf / green tea botanical blend',
    bagCount: 30,
    netWeightG: 55,
    flavour: 'Earthy, comforting tropical leaf brew',
    brewingAndStorage: TEA_BAG_BREWING,
  },
  'natural-lemon-ginger': {
    ingredients: 'Lemon, ginger',
    bagCount: 15,
    netWeightG: 75,
    flavour: 'Zesty lemon with warming ginger — naturally caffeine-free',
    brewingAndStorage: TEA_BAG_BREWING,
  },
  'papaya-cinnamon': {
    ingredients: 'Papaya leaf, cinnamon',
    bagCount: 20,
    netWeightG: 75,
    flavour: 'Warm papaya leaf with sweet cinnamon',
    brewingAndStorage: TEA_BAG_BREWING,
  },
  'beetroot-ginger': {
    ingredients: 'Beetroot, ginger',
    bagCount: 20,
    netWeightG: 130,
    flavour: 'Earthy beetroot with warming ginger',
    brewingAndStorage: TEA_BAG_BREWING,
  },
  'green-lemon-slices': {
    ingredients: 'Green lemons',
    netWeightG: 100,
    flavour: 'Vibrant, tart citrus — bright in water or tea',
    brewingAndStorage:
      'Add 1–2 slices to a cup of hot water, iced tea, or a jug in the fridge. The tart citrus flavour comes through in a few minutes. Keep the bag sealed in a cool, dry place away from sunlight.',
  },
};

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function text(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed || null;
}

function number(value: unknown): number | null {
  const n = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(n) && n > 0 ? n : null;
}

export function productFacts(input: {
  slug?: string | null;
  metadata?: unknown;
}): ProductFacts {
  const slug = String(input.slug || '');
  const meta = asRecord(input.metadata);
  const catalog = CATALOG[slug];

  const ingredients = text(meta.ingredients) || catalog?.ingredients || null;
  const bagCount = number(meta.bag_count) ?? catalog?.bagCount ?? null;
  const netWeightG = number(meta.net_weight_g) ?? catalog?.netWeightG ?? null;
  const flavour = text(meta.flavour) || catalog?.flavour || null;
  const brewingAndStorage =
    text(meta.brewing_and_storage) ||
    catalog?.brewingAndStorage ||
    TEA_BAG_BREWING;

  const features: string[] = [];
  if (ingredients) features.push(`Ingredients: ${ingredients}`);
  if (bagCount) features.push(`${bagCount} tea bags`);
  if (netWeightG) features.push(`Net weight: ${netWeightG}g`);
  if (flavour) features.push(`Flavour: ${flavour}`);

  return {
    features: features.length
      ? features
      : ['FDA-registered Ghanaian botanical infusion', 'Made in Ghana'],
    brewingAndStorage,
  };
}
