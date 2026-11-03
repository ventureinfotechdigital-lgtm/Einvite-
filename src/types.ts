export interface EventItem {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  description: string;
  dressCode?: string;
  icon?: string;
  photoUrl?: string;
  bgImageUrl?: string;
  blessingCount?: number;
  muhurat?: string;
  tagline?: string;
  attireColors?: string[];
  rituals?: string[];
}

export interface GalleryPhoto {
  id: string;
  url: string;
  caption: string;
  date?: string;
}

export interface RSVPResponse {
  id: string;
  name: string;
  phone: string;
  guests: number;
  attending: boolean;
  message: string;
  submittedAt: string;
}

export interface InvitationTheme {
  presetId?: string;
  culturalTheme?: string;
  themeName?: string;
  badge?: string;
  subtitle?: string;
  primaryBg?: string;
  cardBg?: string;
  accentGold?: string;
  borderGold?: string;
  textPrimary?: string;
  textSecondary?: string;
  badgeBg?: string;
  badgeText?: string;
  gradient?: string;
  shloka?: string;
  shlokaMeaning?: string;
  poeticNote?: string;
  culturalInvocation?: string;
  musicPreset: 'shehnai' | 'sitar' | 'flute' | 'romantic';
  petalColors?: string[];
  primaryTone?: string;
  backdropArtwork?: string;
  style?: string;
}

export type PricingTierPrice = 1499 | 1999 | 2499 | 2999;

export interface PricingPlan {
  id: string;
  name: string;
  price: PricingTierPrice;
  originalPrice: number;
  discount: string;
  tierLevel: 'classic' | 'gold' | 'imperial' | 'ultra';
  badge: string;
  tagline: string;
  features: string[];
  recommendedDesigns: string[];
}

export interface OrderRecord {
  orderId: string;
  paymentId: string;
  signature?: string;
  licenseKey: string;
  planId: string;
  planName: string;
  amount: number;
  currency: string;
  coupleNames: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  paidAt: string;
  status: 'PAID_AND_ACTIVE' | 'PENDING';
  isDemo: boolean;
  unlockedFeatures: string[];
}

export interface InvitationConfig {
  id: string;
  groomName: string;
  brideName: string;
  monogramText: string;
  weddingDate: string; // e.g. "2026-12-14"
  weddingTime: string; // e.g. "18:00"
  weddingDateFormatted: string; // e.g. "December 14, 2026"
  venueName: string;
  venueCity: string;
  venueAddress: string;
  googleMapsUrl: string;
  hashtag: string;
  welcomeMessage: string;
  heroCouplePhoto: string;
  scratchRevealPhoto: string;
  scratchRevealHeading: string;
  scratchRevealNote: string;
  galleryPhotos: GalleryPhoto[];
  events: EventItem[];
  rsvpResponses: RSVPResponse[];
  theme: InvitationTheme;
  isUnlocked?: boolean;
  activeOrder?: OrderRecord | null;
}

export type ViewMode = 'split' | 'phone-only' | 'fullscreen';

