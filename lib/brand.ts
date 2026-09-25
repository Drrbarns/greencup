/**
 * Green Cup — Ghanaian FDA-registered teas & botanical infusions
 */
export const APP_TITLE = 'Green Cup';
export const BRAND_NAME = 'Green Cup';
export const SHORT_NAME = 'Green Cup';
export const TAGLINE = 'A Daily Source Of Well-being';
export const SLOGAN = 'Brew Nature. Feel Better.';

export const BRAND_INTRO =
  'Green Cup is a Ghanaian tea house from Shapes Pro Ltd. Every blend is FDA-registered, made in Ghana, and brewed for everyday calm, vitality, and ritual — not a walk-in shop, a cup you can trust.';

export const BRAND_INTRO_SECONDARY =
  'From soursop leaf and lemon-ginger to guava, papaya-cinnamon, and beetroot, we craft small-batch infusions you can drink hot or iced. Shop online, then pick up at Spintex or have it sent across Ghana.';

export const SITE_URL_DEFAULT = 'https://greencup4u.com';
export const LOGO_PATH = '/logo.png?v=20260917';
export const OG_IMAGE_PATH = '/og-image.png';

export const CONTACT_ADDRESS = 'GCB Bank, White House, Spintex Road, Accra';
export const CONTACT_PHONE = '0555556787';
export const CONTACT_PHONE_DISPLAY = '055 555 6787';
export const CONTACT_WHATSAPP = '0555556787';
export const WHATSAPP_LINK = 'https://wa.me/233555556787';
export const WHATSAPP_SHOP_NOTE =
  'This is a fulfillment location, not a walk-in shop — confirm a pickup time so the package is ready.';

export const INSTAGRAM_HANDLE = '@greencup4you';
export const INSTAGRAM_URL = 'https://instagram.com/greencup4you';
export const SNAPCHAT_HANDLES: string[] = [];

export const SUPPORT_EMAIL = 'greencup4you@gmail.com';
export const ADMIN_EMAIL_DEFAULT = 'greencup4you@gmail.com';
export const EMAIL_FROM_DEFAULT = 'Green Cup <greencup4you@gmail.com>';

export const CURRENCY = 'GHS';
export const CURRENCY_SYMBOL = 'GH₵';
export const SUPABASE_PROJECT_REF = 'YOUR_PROJECT_ID';

export const FONTS = {
  display: 'Cormorant Garamond',
  sans: 'Manrope',
} as const;

/** Same token names as Green Cup; Green Cup leaf-and-cream palette. */
export const COLORS = {
  primary: '#1B3A2F',
  secondary: '#EEF2E9',
  accent: '#D8B47F',
  highlight: '#718075',
  background: '#F7F3EB',
  text: '#254535',
} as const;

export const LOGO_CLASS_HEADER = 'h-10 md:h-12 w-auto object-contain';

export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Categories', href: '/categories' },
  { label: 'Products', href: '/shop' },
  { label: 'About Us', href: '/about' },
  { label: 'Contact Us', href: '/contact' },
] as const;

export const NAV_LINKS_OPTIONAL = [
  { label: 'New Arrivals', href: '/shop?sort=newest' },
  { label: 'Featured', href: '/shop?featured=true' },
] as const;

export const FOOTER_TAGLINE =
  'FDA-registered Ghanaian teas and botanical infusions. Brew nature. Feel better.';

export const HERO_IMAGE_VERSION = '20260916c';
export const HERO_IMAGES = [
  '/hero/lifestyle-hero-1.jpg',
  '/hero/lifestyle-hero-2.jpg',
  '/hero/lifestyle-hero-3.jpg',
] as const;

export const HOME_CATEGORIES = [
  { id: 'wellness', name: 'Wellness Blends', subtitle: 'Daily calm and vitality', slug: 'wellness', tint: 'from-[#2D5A3D]/70 via-[#EEF2E9]/60 to-[#F7F3EB]' },
  { id: 'caffeine-free', name: 'Caffeine-Free', subtitle: 'Gentle any time of day', slug: 'caffeine-free', tint: 'from-[#D8B47F]/60 via-[#EEF2E9]/50 to-[#718075]/30' },
  { id: 'citrus', name: 'Citrus & Ginger', subtitle: 'Bright, warming cups', slug: 'citrus', tint: 'from-[#EEF2E9] via-[#F7F3EB] to-[#D8B47F]/30' },
  { id: 'leaf', name: 'Leaf Teas', subtitle: 'Soursop, guava, papaya', slug: 'leaf-teas', tint: 'from-[#1B3A2F]/50 via-[#718075]/40 to-[#D8B47F]/30' },
  { id: 'roots', name: 'Roots & Spice', subtitle: 'Beetroot, ginger, cinnamon', slug: 'roots', tint: 'from-[#2D5A3D]/80 via-[#EEF2E9]/70 to-[#F7F3EB]' },
  { id: 'ritual', name: 'Evening Ritual', subtitle: 'Unwind without caffeine', slug: 'evening', tint: 'from-[#1B3A2F]/45 via-[#EEF2E9]/55 to-[#F7F3EB]' },
] as const;

export const META_DESCRIPTION =
  'Green Cup: FDA-registered Ghanaian green teas and botanical infusions. Shop soursop, lemon-ginger, guava, papaya-cinnamon, beetroot, and dried lemon slices. Made in Ghana.';

export const REFUND_POLICY = {
  title: 'Refund policy',
  refundIntro: 'A refund may be approved when one of the following applies:',
  refundReasons: [
    'A damaged or defective pack was delivered.',
    'There was a mix-up in your order.',
    'You paid for a blend that was already sold out.',
    'A package was misplaced before pickup or dispatch.',
  ],
  exchangeTitle: 'Exchange requirements',
  exchangeBody:
    'Items must be unopened, undamaged, and in the original sealed packaging to qualify for an exchange.',
  exchangeWindow:
    'Exchanges must be completed within 24 hours of purchase. After that window, exchange eligibility is no longer valid.',
  finalNote:
    'If an item is received outside the criteria stated above, a return or exchange cannot be processed. Message us on WhatsApp before you send anything back.',
  contactCta: 'Questions? WhatsApp us or arrange a confirmed pickup at Spintex.',
} as const;
