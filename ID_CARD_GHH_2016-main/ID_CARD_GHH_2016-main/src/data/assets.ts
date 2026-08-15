/**
 * Centralized Asset Registry for HH Goa 2026
 * Mapped directly from the official /assets directory.
 */

export interface AssetMeta {
  id: string;
  name: string;
  path: string;
  type: 'svg' | 'png';
  category: 'BRANDING' | 'BACKGROUND' | 'TROPICAL' | 'GOA' | 'HACKER' | 'DECORATION' | 'SOCIAL';
  width: number;
  height: number;
  description: string;
}

export const ASSETS = {
  // BRANDING
  HACKER_HOUSE_LOGO: {
    id: 'hacker-house-logo',
    name: 'Hacker House Logo',
    path: '/assets/Hacker house.png',
    type: 'png',
    category: 'BRANDING',
    width: 1148,
    height: 237,
    description: 'Official Hacker House typography branding logo'
  },
  GOA_HINDI_BADGE: {
    id: 'goa-hindi-badge',
    name: 'Goa Hindi Badge',
    path: '/assets/goa_hindi.svg',
    type: 'svg',
    category: 'BRANDING',
    width: 181,
    height: 180,
    description: 'Circular badge with Hindi Goa artwork and pink stroke'
  },
  STUDIO_EMBLEM: {
    id: 'studio-emblem',
    name: '2:47 PM Studio Logo',
    path: '/assets/2-47.png',
    type: 'png',
    category: 'BRANDING',
    width: 546,
    height: 335,
    description: 'Official stylized 2:47 PM Studio typography logo PNG'
  },
  STUDIO_LOGO_PNG: {
    id: 'studio-logo-png',
    name: '2:47 PM Studio Logo PNG',
    path: '/assets/2-47.png',
    type: 'png',
    category: 'BRANDING',
    width: 546,
    height: 335,
    description: 'Official stylized 2:47 PM Studio typography logo PNG'
  },
  // Backward-compatible alias
  ORGANIC_SUN_CLOUD: {
    id: 'organic-sun-cloud',
    name: '2:47 PM Studio Logo',
    path: '/assets/2-47.png',
    type: 'png',
    category: 'BRANDING',
    width: 546,
    height: 335,
    description: 'Official stylized 2:47 PM Studio typography logo PNG'
  },
  HH_GOA_STACKED_LARGE: {
    id: 'hh-goa-stacked-large',
    name: 'HH Goa Stacked Logo Large',
    path: '/assets/179-vector-54-30944.svg',
    type: 'svg',
    category: 'BRANDING',
    width: 291,
    height: 255,
    description: 'Official Hacker House Goa stacked typography with Hindi emblem'
  },
  HH_GOA_STACKED_SMALL: {
    id: 'hh-goa-stacked-small',
    name: 'HH Goa Stacked Logo Small',
    path: '/assets/036-vector-54-3934.svg',
    type: 'svg',
    category: 'BRANDING',
    width: 155,
    height: 135,
    description: 'Official Hacker House Goa small badge'
  },

  // BACKGROUND & SCENERY
  SUN_RISE: {
    id: 'sun-rise',
    name: 'Goa Sunrise',
    path: '/assets/Sun rise.png',
    type: 'png',
    category: 'BACKGROUND',
    width: 1440,
    height: 1438,
    description: 'Golden tropical Goa sun with radiant rays and palm silhouettes'
  },
  SUN_RISE_2: {
    id: 'sun-rise-2',
    name: 'Goa Sunrise 2',
    path: '/assets/sun rise 2.png',
    type: 'png',
    category: 'BACKGROUND',
    width: 1440,
    height: 900,
    description: 'Vibrant Goa sunrise scenery with tropical palms'
  },
  AGENDA_BG: {
    id: 'agenda-bg',
    name: 'Goa Beach Agenda Scene',
    path: '/assets/agenda.png',
    type: 'png',
    category: 'GOA',
    width: 1440,
    height: 872,
    description: 'Goa beach landscape with house, palms, and signposts'
  },
  DETAILS_BG: {
    id: 'details-bg',
    name: 'Goa Sunset Scenery',
    path: '/assets/details.png',
    type: 'png',
    category: 'GOA',
    width: 1440,
    height: 937,
    description: 'Atmospheric Goa landscape with palm vegetation and coastal buildings'
  },

  // TROPICAL & ENVIRONMENTAL
  FOOTER_TREES: {
    id: 'footer-trees',
    name: 'Goa Palm Trees',
    path: '/assets/footer trees.png',
    type: 'png',
    category: 'TROPICAL',
    width: 1440,
    height: 887,
    description: 'Lush tropical palm tree silhouettes and greenery'
  },

  // HACKER / BUILDER
  HACKERS_CREW: {
    id: 'hackers-crew',
    name: 'Goa Hacker Crew',
    path: '/assets/hackers.png',
    type: 'png',
    category: 'HACKER',
    width: 1440,
    height: 804,
    description: 'Hand-drawn builders coding under Goa palms with laptops and tropical vibe'
  },

  // DECORATION & STICKERS
  GOA_BANNER_BORDER: {
    id: 'goa-banner-border',
    name: 'Goa Pattern Border Banner',
    path: '/assets/019-group-59467-54-3485.svg',
    type: 'svg',
    category: 'DECORATION',
    width: 2501,
    height: 74,
    description: 'Intricate horizontal Goa border banner in green and hot pink'
  },
  STICKER_BURST_SMALL: {
    id: 'sticker-burst-small',
    name: 'HH Goa Badge Small',
    path: '/assets/036-vector-54-3934.svg',
    type: 'svg',
    category: 'DECORATION',
    width: 155,
    height: 135,
    description: 'Hand-drawn starburst / stamp sticker'
  },
  STICKER_BURST_LARGE: {
    id: 'sticker-burst-large',
    name: 'HH Goa Stacked Large',
    path: '/assets/179-vector-54-30944.svg',
    type: 'svg',
    category: 'DECORATION',
    width: 291,
    height: 255,
    description: 'Large decorative starburst graphic element'
  },
  LEAF_DIVIDER_1: {
    id: 'leaf-divider-1',
    name: 'Leaf Border Line 1',
    path: '/assets/138-frame-1948755142-54-27257.svg',
    type: 'svg',
    category: 'DECORATION',
    width: 1282,
    height: 20,
    description: 'Green leafy horizontal divider line'
  },
  LEAF_DIVIDER_2: {
    id: 'leaf-divider-2',
    name: 'Leaf Border Line 2',
    path: '/assets/140-frame-1948755145-54-27273.svg',
    type: 'svg',
    category: 'DECORATION',
    width: 1282,
    height: 20,
    description: 'Green leafy horizontal divider line'
  },
  DOT_DIVIDER_1: {
    id: 'dot-divider-1',
    name: 'Dot Diamond Line 1',
    path: '/assets/002-group-54-14.svg',
    type: 'svg',
    category: 'DECORATION',
    width: 102,
    height: 7,
    description: 'Geometric diamond separator in green and pink'
  },
  DOT_DIVIDER_2: {
    id: 'dot-divider-2',
    name: 'Dot Diamond Line 2',
    path: '/assets/008-group-54-324.svg',
    type: 'svg',
    category: 'DECORATION',
    width: 102,
    height: 7,
    description: 'Geometric diamond separator in green and pink'
  },
  DOT_DIVIDER_3: {
    id: 'dot-divider-3',
    name: 'Dot Diamond Line 3',
    path: '/assets/149-group-54-27351.svg',
    type: 'svg',
    category: 'DECORATION',
    width: 102,
    height: 7,
    description: 'Geometric diamond separator'
  },
  DOT_DIVIDER_4: {
    id: 'dot-divider-4',
    name: 'Dot Diamond Line 4',
    path: '/assets/155-group-54-27661.svg',
    type: 'svg',
    category: 'DECORATION',
    width: 102,
    height: 7,
    description: 'Geometric diamond separator'
  },

  // SOCIAL ICONS
  ICON_X_TWITTER: {
    id: 'icon-x-twitter',
    name: 'X Twitter Logo',
    path: '/assets/180-frame-1948754793-54-30952.svg',
    type: 'svg',
    category: 'SOCIAL',
    width: 28,
    height: 25,
    description: 'X / Twitter logo in brand yellow'
  },
  ICON_TELEGRAM: {
    id: 'icon-telegram',
    name: 'Telegram Logo',
    path: '/assets/181-frame-1948754789-54-30958.svg',
    type: 'svg',
    category: 'SOCIAL',
    width: 28,
    height: 23,
    description: 'Telegram logo in brand yellow'
  },
  ICON_MAIL: {
    id: 'icon-mail',
    name: 'Mail Icon',
    path: '/assets/182-frame-1948754788-54-30962.svg',
    type: 'svg',
    category: 'SOCIAL',
    width: 28,
    height: 23,
    description: 'Mail envelope icon in brand yellow'
  },
} as const;

export const ALL_ASSETS = Object.values(ASSETS);
