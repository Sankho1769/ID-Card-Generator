const PREFIXES = [
  "Certified", "Chief", "Head of", "Resident", "Freelance", "Self-Appointed",
  "On-Call", "Full-Stack", "Overclocked", "Sunburnt", "Undefeated", "Sleep-Deprived",
];

const ROLES = [
  "Chaos Engineer", "Bug Whisperer", "Merge Conflict Mediator", "Prod Firefighter",
  "Prompt Alchemist", "Pixel Pusher", "Ship-It Specialist", "Latency Hunter",
  "Semicolon Enforcer", "Vibe Architect", "Deploy-on-Friday Advocate", "Stack Overflow Diplomat",
  "Beach-Desk Developer", "Idea-to-Demo Machine", "Coffee-to-Code Converter",
];

function hashSeed(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

/**
 * Generates a builder title. If a seed (e.g. name+stack) is given, the title
 * is stable for that person; otherwise it's random each time.
 */
export function generateBuilderTitle(seed) {
  if (seed) {
    const h = hashSeed(seed);
    const prefix = PREFIXES[h % PREFIXES.length];
    const role = ROLES[Math.floor(h / PREFIXES.length) % ROLES.length];
    return `${prefix} ${role}`;
  }
  const prefix = PREFIXES[Math.floor(Math.random() * PREFIXES.length)];
  const role = ROLES[Math.floor(Math.random() * ROLES.length)];
  return `${prefix} ${role}`;
}
