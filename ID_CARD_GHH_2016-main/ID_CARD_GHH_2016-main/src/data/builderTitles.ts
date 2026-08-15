export interface TitleCategory {
  keywords: string[];
  titles: string[];
}

export const TITLE_CATEGORIES: Record<string, TitleCategory> = {
  design: {
    keywords: ['ui', 'ux', 'design', 'figma', 'product design', 'visual', 'creative', 'graphic'],
    titles: [
      'PIXEL PIRATE',
      'PIXEL SHAMAN',
      'DESIGN REBEL',
      'INTERFACE BANDIT',
      'PALETTE PROPHET',
      'VECTOR VAGABOND',
      'BEZIER BOSS',
      'TYPE TITAN',
      'KERNING KINGPIN'
    ]
  },
  frontend: {
    keywords: ['frontend', 'front-end', 'front end', 'css', 'html', 'tailwind', 'vue', 'svelte', 'angular'],
    titles: [
      'BROWSER BANDIT',
      'COMPONENT COWBOY',
      'CSS WIZARD',
      'FRONTEND SURFER',
      'DOM DOMINATOR',
      'CANVAS CAPTAIN',
      'KEYFRAME KID',
      'FLEXBOX FREAK'
    ]
  },
  react: {
    keywords: ['react', 'next', 'nextjs', 'remix', 'react native'],
    titles: [
      'COMPONENT ALCHEMIST',
      'REACT ROGUE',
      'HOOK HUNTER',
      'VIRTUAL DOM VOYAGER',
      'STATE SAMURAI',
      'RE-RENDER REBEL'
    ]
  },
  backend: {
    keywords: ['backend', 'back-end', 'node', 'express', 'python', 'django', 'fastapi', 'golang', 'go', 'java', 'sql', 'database', 'postgres'],
    titles: [
      'API ALCHEMIST',
      'SERVER SHAMAN',
      'BACKEND RAIDER',
      'DATABASE DRUID',
      'ENDPOINT ENCHANTER',
      'QUERY QUEEN',
      'BYTE BANDIT'
    ]
  },
  ai: {
    keywords: ['ai', 'ml', 'machine learning', 'llm', 'prompt', 'gpt', 'neural', 'deep learning', 'vision', 'data science'],
    titles: [
      'PROMPT PIRATE',
      'MODEL MAGE',
      'AI ALCHEMIST',
      'TENSOR TRAVELER',
      'NEURAL NOMAD',
      'LATENT LURKER',
      'GPU GLADIATOR',
      'WEIGHTS WIZARD'
    ]
  },
  fullstack: {
    keywords: ['full stack', 'fullstack', 'full-stack', 'software engineer', 'developer', 'builder', 'engineer', 'tech lead'],
    titles: [
      'STACK SURFER',
      'STACK RAIDER',
      'SHIP CAPTAIN',
      'OCTOPUS CODER',
      'MONOREPO MONSTER',
      'PRODUCTION PILOT'
    ]
  },
  mobile: {
    keywords: ['mobile', 'ios', 'android', 'flutter', 'swift', 'kotlin', 'react native'],
    titles: [
      'APP NOMAD',
      'MOBILE MAVERICK',
      'FLUTTER FOX',
      'SWIFT SHARK',
      'APK ALCHEMIST',
      'NATIVE NINJA'
    ]
  },
  devops: {
    keywords: ['devops', 'cloud', 'infra', 'infrastructure', 'aws', 'docker', 'kubernetes', 'k8s', 'ci/cd', 'linux'],
    titles: [
      'CLOUD RAIDER',
      'DEPLOYMENT PIRATE',
      'DOCKER DRIFTER',
      'KUBERNETES KNIGHT',
      'PIPELINE PILOT',
      'UPTIME OVERLORD'
    ]
  },
  web3: {
    keywords: ['web3', 'crypto', 'solana', 'ethereum', 'smart contract', 'blockchain', 'rust', 'defi'],
    titles: [
      'BLOCKCHAIN BARON',
      'RUST ROVER',
      'SMART CONTRACT SAILOR',
      'SOLANA SURFER',
      'GASLESS GURU',
      'ON-CHAIN OUTLAW'
    ]
  },
  general: {
    keywords: [],
    titles: [
      'CODE NOMAD',
      'SHIP BUILDER',
      'PRODUCT PIRATE',
      'DIGITAL DRIFTER',
      'GOA BUILDER',
      'PARADISE PROGRAMMER',
      'CHAOS CAPTAIN',
      'MIDNIGHT HACKER',
      'TROPICAL TECHNOID',
      'BEACHSIDE BUILDER'
    ]
  }
};

/**
 * Deterministically or randomly suggests a builder title given role or stack
 */
export function getBuilderTitle(role: string, name?: string, forceRandom = false): string {
  const normalized = (role || '').toLowerCase().trim();
  
  // Find matching category
  let matchedTitles: string[] = [];
  for (const [key, cat] of Object.entries(TITLE_CATEGORIES)) {
    if (key === 'general') continue;
    if (cat.keywords.some(kw => normalized.includes(kw))) {
      matchedTitles.push(...cat.titles);
    }
  }

  if (matchedTitles.length === 0) {
    matchedTitles = TITLE_CATEGORIES.general.titles;
  }

  if (forceRandom) {
    const all = [...matchedTitles, ...TITLE_CATEGORIES.general.titles];
    return all[Math.floor(Math.random() * all.length)];
  }

  // Deterministic seed based on name + role length
  const seedString = `${name || ''}-${role || 'builder'}`;
  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = (hash << 5) - hash + seedString.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % matchedTitles.length;
  return matchedTitles[index];
}
