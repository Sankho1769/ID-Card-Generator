export type StyleId = 'beach-club' | 'night-hacker' | 'goa-sunset';

export interface StyleTheme {
  id: StyleId;
  name: string;
  subtitle: string;
  tagline: string;
  bgColor: string;
  bgGradient: string;
  cardBg: string;
  accentColor: string;
  secondaryColor: string;
  frameColor: string;
  textColor: string;
  headerTextColor: string;
  badgeBg: string;
  badgeText: string;
  previewBg: string;
  iconName: string;
  vibeDescription: string;
}

export const STYLES: Record<StyleId, StyleTheme> = {
  'beach-club': {
    id: 'beach-club',
    name: 'BEACH CLUB',
    subtitle: 'TROPICAL · CHILL · DAYTIME',
    tagline: 'Code with the waves in your ears',
    bgColor: '#0B6839',
    bgGradient: 'linear-gradient(180deg, #04321A 0%, #0B6839 50%, #084E2A 100%)',
    cardBg: '#084E2A',
    accentColor: '#FEE101',
    secondaryColor: '#9AC95F',
    frameColor: '#FEE101',
    textColor: '#FFFDF5',
    headerTextColor: '#FEE101',
    badgeBg: '#FEE101',
    badgeText: '#000000',
    previewBg: 'bg-[#0B6839] border-[#FEE101]',
    iconName: 'Palmtree',
    vibeDescription: 'Green dominant, yellow sun, palm trees, relaxed coastal Goa atmosphere.'
  },
  'night-hacker': {
    id: 'night-hacker',
    name: 'NIGHT HACKER',
    subtitle: 'MIDNIGHT · CYBER-TROPICAL · STICKER PACK',
    tagline: 'Shipping commits under the Goa stars',
    bgColor: '#032011',
    bgGradient: 'linear-gradient(180deg, #02140A 0%, #032011 50%, #0E2E1F 100%)',
    cardBg: '#032011',
    accentColor: '#FF0080',
    secondaryColor: '#FEE101',
    frameColor: '#FF0080',
    textColor: '#FFFDF5',
    headerTextColor: '#FF0080',
    badgeBg: '#FF0080',
    badgeText: '#FFFFFF',
    previewBg: 'bg-[#032011] border-[#FF0080]',
    iconName: 'Zap',
    vibeDescription: 'Deep forest black, hot pink frames, yellow highlights, sticker-heavy hacker energy.'
  },
  'goa-sunset': {
    id: 'goa-sunset',
    name: 'GOA SUNSET',
    subtitle: 'WARM GOLD · RETRO POSTER · SUNRISE',
    tagline: 'Golden hour pixels and sea breeze',
    bgColor: '#C78118',
    bgGradient: 'linear-gradient(180deg, #2D1405 0%, #68300B 50%, #0B6839 100%)',
    cardBg: '#2D1405',
    accentColor: '#FEE101',
    secondaryColor: '#FF6B00',
    frameColor: '#FFFDF5',
    textColor: '#FFFDF5',
    headerTextColor: '#FEE101',
    badgeBg: '#FEE101',
    badgeText: '#000000',
    previewBg: 'bg-[#68300B] border-[#FEE101]',
    iconName: 'Sun',
    vibeDescription: 'Warm golden hues, sunrise scenery, retro poster composition with tropical warmth.'
  }
};

export const STYLE_LIST = Object.values(STYLES);
