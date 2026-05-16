export const enUS = {
  seo: {
    title: 'StellarTrail | Outdoor gear and knot skill companion',
    description: 'StellarTrail helps you prepare gear lists and learn practical knot skills before heading outdoors, with a lightweight WeChat and Web experience.'
  },
  nav: {
    product: 'Product',
    gear: 'Gear',
    skills: 'Skills',
    screenshots: 'Screenshots',
    entry: 'Entry',
    language: 'Language'
  },
  hero: {
    eyebrow: 'StellarTrail',
    title: 'Prepare gear and knot skills before you head out',
    subtitle: 'A lightweight companion for outdoor preparation: organize gear lists, learn practical knot skills, and keep a bright day-mode experience across WeChat and Web.',
    primaryCta: 'View mini program entry',
    secondaryCta: 'Explore product',
    note: 'This site only presents currently available gear and outdoor skill capabilities.',
    statGear: 'Gear lists',
    statSkill: 'Knot skills',
    statMode: 'Day-mode shots'
  },
  product: {
    eyebrow: 'Product focus',
    title: 'Designed for the preparation phase before going outdoors',
    body: 'StellarTrail brings gear preparation, skill learning, and entry information into a calm, clear interface. The official site is fully static, loads fast, and stays simple to deploy and maintain.',
    cards: {
      fast: { title: 'Lightweight and honest', body: 'The site only promises capabilities that can be shown today, without inflating expectations.' },
      bilingual: { title: 'Bilingual by default', body: 'It detects the system language on first visit and lets people switch and persist their preference.' },
      polished: { title: 'Polished motion', body: 'Morning light, contour lines, and gentle floating details create an outdoor brand feeling.' }
    }
  },
  gear: {
    eyebrow: 'Gear library',
    title: 'Turn preparation into a practical checklist',
    body: 'The gear library introduces basic backpacking templates, categories, and preparation thinking. The official site focuses on understanding what to prepare rather than complex operations.',
    bullets: ['Understand gear categories by use case', 'Start from templates for preparation lists', 'Browse clearly on mobile and desktop']
  },
  skills: {
    eyebrow: 'Outdoor skills',
    title: 'Start with knots that are useful in the field',
    body: 'Outdoor skills currently focus on knots. The highlighted skill is the adjustable guyline hitch, useful for tuning tent, tarp, and guyline tension after load is applied.',
    bullets: ['Current capability: knot tutorials', 'Example skill: adjustable guyline hitch', 'Good for quick review before departure']
  },
  screenshots: {
    eyebrow: 'Product screenshots',
    title: 'WeChat and Web views in day mode',
    body: 'All official-site materials use day mode. If the final runtime is unavailable, the asset names stay stable so real captures can replace them later.',
    wechatGearAlt: 'WeChat gear page screenshot in day mode',
    wechatKnotsAlt: 'WeChat knot skill page screenshot in day mode',
    webGearAlt: 'Web gear showcase screenshot in day mode',
    webSkillsAlt: 'Web knot skill showcase screenshot in day mode'
  },
  entry: {
    eyebrow: 'Download / mini program entry',
    title: 'WeChat mini program entry is being prepared',
    body: 'The official mini program QR code will be placed here once published. For now, the site explains the entry status instead of showing an unusable or fake code.',
    badge: 'Coming soon',
    hint: 'Search StellarTrail in WeChat or wait for the official QR code release.'
  },
  footer: {
    tagline: 'StellarTrail',
    domainFallback: 'Current deployment URL',
    rights: 'All rights reserved.'
  },
  language: {
    current: 'English',
    switchTo: '切换到中文'
  }
} as const;
