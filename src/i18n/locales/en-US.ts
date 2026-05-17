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
    docs: 'Docs',
    language: 'Language'
  },
  hero: {
    eyebrow: 'StellarTrail',
    title: 'Prepare gear and knot skills before you head out',
    subtitle: 'A lightweight companion for outdoor preparation: organize gear lists, learn practical knot skills, and keep a consistent experience across WeChat and Web.',
    primaryCta: 'View mini program entry',
    secondaryCta: 'Explore product',
    note: 'Gear library and outdoor skill features are available now.',
    statGear: 'Gear lists',
    statSkill: 'Knot skills',
    statMode: 'Product views'
  },
  product: {
    eyebrow: 'Product focus',
    title: 'Designed for the preparation phase before going outdoors',
    body: 'StellarTrail gathers gear preparation, skill learning, and entry information into a calm, clear interface so you can quickly confirm what to pack and which key skills to review before leaving.',
    cards: {
      fast: { title: 'Gear library', body: 'Organize gear categories, preparation templates, and checklists by trip scenario so you can confirm what to pack faster.' },
      bilingual: { title: 'Knot skills', body: 'Start with common knots such as the adjustable tent-line knot, with use cases, steps, and practical reminders.' },
      polished: { title: 'Multi-device access', body: 'Use WeChat for quick checks before heading out, and Web for browsing and organizing preparation content on desktop.' }
    }
  },
  gear: {
    eyebrow: 'Gear library',
    title: 'Turn preparation into a practical checklist',
    body: 'The gear library introduces basic backpacking templates, categories, and preparation thinking. It helps people understand what to prepare before their first deeper look at the product.',
    bullets: ['Understand gear categories by use case', 'Start from templates for preparation lists', 'Browse clearly on mobile and desktop']
  },
  skills: {
    eyebrow: 'Outdoor skills',
    title: 'Start with knots that are useful in the field',
    body: 'Outdoor skills currently focus on knots. The adjustable guyline hitch helps tune tent, tarp, and guyline tension after load is applied.',
    bullets: ['Current capability: knot tutorials', 'Example skill: adjustable guyline hitch', 'Good for quick review before departure']
  },
  screenshots: {
    eyebrow: 'Product screenshots',
    title: 'WeChat and Web views',
    body: 'Review gear and knot skills on WeChat, then organize lists and add gear details on Web.',
    wechatTitle: 'WeChat',
    wechatBody: 'Check gear management and knot skills on the go.',
    webTitle: 'Web',
    webBody: 'Manage gear lists and add detailed gear information on a larger screen.',
    wechatGearAlt: 'WeChat gear management interface',
    wechatKnotsAlt: 'WeChat knot skills interface',
    webGearAlt: 'Web gear management interface',
    webGearFormAlt: 'Web add-gear form interface'
  },
  entry: {
    eyebrow: 'Download / mini program entry',
    title: 'WeChat mini program entry is being prepared',
    body: 'The official mini program QR code will be placed here once published. For now, this section explains the entry status instead of showing an unusable or fake code.',
    badge: 'Coming soon',
    hint: 'Search StellarTrail in WeChat or wait for the official QR code release.'
  },
  docs: {
    seo: {
      title: 'StellarTrail API Reference',
      description: 'A static reference for the currently available StellarTrail backend API paths.'
    },
    nav: {
      label: 'API reference navigation',
      brand: 'StellarTrail Docs',
      backHome: 'Back to site'
    },
    hero: {
      eyebrow: 'Developer docs',
      title: 'API Reference',
      body: 'This page records the read-only backend behavior that is currently present and verified. Examples use paths and environment placeholders only; the production access origin is not displayed here.'
    },
    toc: {
      label: 'Table of contents'
    },
    source: {
      title: 'Source information',
      repository: 'Source repository',
      inspectedHead: 'Inspected version',
      inspectedAt: 'Inspected date'
    },
    sections: {
      overview: {
        title: 'Overview',
        body: 'The first version covers service health, service metadata, and the common not-found response. When backend behavior grows, update this page from the real service source and response definitions first.',
        note: 'This is a static documentation page. It does not request the backend from the browser.'
      },
      authentication: {
        title: 'Authentication',
        body: 'The listed read paths currently do not require a signed-in user. Future user-scoped behavior should document authentication, permission boundaries, and error responses separately.'
      },
      endpoints: {
        title: 'Endpoints',
        body: 'Currently verified read paths.'
      },
      errors: {
        title: 'Error responses',
        body: 'Unmatched resources return a consistent JSON error shape.'
      },
      config: {
        title: 'Access configuration',
        body: 'The production access origin is stored only in deployment-side or ignored local config. It must not be committed, rendered, or bundled. Use your own environment variable and append the path when calling the service.'
      }
    },
    endpointSummaries: {
      health: 'Service health',
      meta: 'Service metadata'
    },
    labels: {
      responseStatus: 'Response status'
    }
  },
  footer: {
    tagline: 'StellarTrail',
    caption: 'Outdoor preparation starts with checklists and knots',
    rights: 'All rights reserved.'
  },
  language: {
    current: 'English',
    switchTo: '切换到中文'
  }
} as const;
