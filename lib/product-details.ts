export type TasteCopy = {
  profile: string;
  notes: string;
};

export type ProductFacts = {
  features: string[];
  brewingAndStorage: string;
  taste: TasteCopy | null;
};

type CatalogFacts = {
  ingredients: string;
  bagCount?: number;
  netWeightG?: number;
  flavour?: string;
  taste?: TasteCopy;
  brewingAndStorage: string;
};

const TEA_BAG_BREWING =
  'Steep 1 tea bag in a cup of freshly boiled water for 3–5 minutes. Drink it hot, or let it cool and pour over ice. Keep the pack sealed in a cool, dry place away from sunlight and strong smells so the leaves stay fresh.';

const CATALOG: Record<string, CatalogFacts> = {
  'soursop-brew': {
    ingredients: '100% soursop leaves',
    bagCount: 50,
    netWeightG: 55,
    flavour: 'Earthy, smooth, and grounding',
    taste: {
      profile: 'Earthy, smooth, and grounding.',
      notes:
        'Mildly woody with delicate herbal undertones, subtle citrus-vegetal brightness, and a clean, silky finish. It drinks much like an unroasted, gentle green tea without any bitterness.',
    },
    brewingAndStorage: TEA_BAG_BREWING,
  },
  'guava-green-brew': {
    ingredients: 'Guava leaf / green tea botanical blend',
    bagCount: 30,
    netWeightG: 55,
    flavour: 'Crisp, herbaceous, and aromatic',
    taste: {
      profile: 'Crisp, herbaceous, and aromatic.',
      notes:
        'A naturally light, tannic structure reminiscent of fine green or light black tea, paired with subtle floral accents and a lingering, dry, refreshing aftertaste.',
    },
    brewingAndStorage: TEA_BAG_BREWING,
  },
  'natural-lemon-ginger': {
    ingredients: 'Lemon, ginger',
    bagCount: 15,
    netWeightG: 75,
    flavour: 'Zesty, warming, and invigorating',
    taste: {
      profile: 'Zesty, warming, and invigorating.',
      notes:
        'Vibrant, sun-dried citrus tang balanced by the bold, spicy heat of real ginger. It delivers an awakening, palate-cleansing warmth that comforts the throat and finishes crisp.',
    },
    brewingAndStorage: TEA_BAG_BREWING,
  },
  'papaya-cinnamon': {
    ingredients: 'Papaya leaf, cinnamon',
    bagCount: 20,
    netWeightG: 75,
    flavour: 'Spiced, rich, and mellow',
    taste: {
      profile: 'Spiced, rich, and mellow.',
      notes:
        'Papaya leaf’s deep, earthy herbal notes are rounded out and sweetened by the cozy, aromatic woodiness of sweet cinnamon. It creates a well-rounded, lightly sweet brew with a comforting aroma.',
    },
    brewingAndStorage: TEA_BAG_BREWING,
  },
  'beetroot-ginger': {
    ingredients: 'Beetroot, ginger',
    bagCount: 20,
    netWeightG: 130,
    flavour: 'Robust, earthy-sweet, and fiery',
    taste: {
      profile: 'Robust, earthy-sweet, and fiery.',
      notes:
        'Deep root-sweetness and rich earthy tones from beetroot meet a sharp, punchy kick of ginger. Full-bodied and vibrant in the cup, it leaves a pleasant, lingering warmth.',
    },
    brewingAndStorage: TEA_BAG_BREWING,
  },
  'green-lemon-slices': {
    ingredients: 'Green lemons',
    netWeightG: 100,
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
  const taste = resolveTaste(meta, catalog);
  const flavour = taste?.profile.replace(/\.$/, '') || text(meta.flavour) || catalog?.flavour || null;
  const brewingAndStorage =
    text(meta.brewing_and_storage) ||
    catalog?.brewingAndStorage ||
    TEA_BAG_BREWING;

  const features: string[] = [];
  if (ingredients) features.push(`Ingredients: ${ingredients}`);
  if (bagCount) features.push(`${bagCount} tea bags`);
  if (netWeightG) features.push(`Net weight: ${netWeightG}g`);
  if (flavour) features.push(`Taste profile: ${flavour}`);

  return {
    features: features.length
      ? features
      : ['FDA-registered Ghanaian botanical infusion', 'Made in Ghana'],
    brewingAndStorage,
    taste,
  };
}

function resolveTaste(
  meta: Record<string, unknown>,
  catalog: CatalogFacts | undefined
): TasteCopy | null {
  const profile = text(meta.taste_profile) || catalog?.taste?.profile || null;
  const notes = text(meta.taste_notes) || catalog?.taste?.notes || null;
  if (!profile || !notes) return catalog?.taste ?? null;
  return { profile, notes };
}

export function tasteProfileForSlug(slug?: string | null): TasteCopy | null {
  if (!slug) return null;
  return CATALOG[slug]?.taste ?? null;
}
