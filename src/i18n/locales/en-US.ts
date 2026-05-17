export const enUS = {
  seo: {
    title: 'StellarTrail | Outdoor gear and knot skill companion',
    description: 'StellarTrail helps you prepare gear lists and learn practical knot skills before heading outdoors across Web, Android, and WeChat Mini Program.'
  },
  nav: {
    product: 'Product intro',
    gear: 'Gear management',
    skills: 'Outdoor skills',
    screenshots: 'Product screenshots',
    entry: 'Downloads',
    docs: 'API Docs',
    language: 'Language'
  },
  jump: {
    label: 'Page quick jumps',
    trigger: 'Expand page quick jumps',
    title: 'On this page',
    home: 'Home'
  },
  hero: {
    eyebrow: 'StellarTrail',
    title: 'Prepare gear and knot skills before you head out',
    subtitle: 'A lightweight companion for outdoor preparation: organize gear lists, learn practical knot skills, and choose the Web, Android, or WeChat Mini Program experience that fits the moment.',
    primaryCta: 'View platform entry',
    secondaryCta: 'Explore product',
    note: 'Web, Android, and WeChat Mini Program are supported now.',
    platformLabel: 'Supported platforms',
    platforms: ['Web app', 'Android app', 'WeChat Mini Program'],
    statGear: 'Gear lists',
    statSkill: 'Knot skills',
    statMode: 'Supported platforms'
  },
  product: {
    eyebrow: 'Product focus',
    title: 'Designed for the preparation phase before going outdoors',
    body: 'StellarTrail gathers gear preparation, skill learning, and entry information into a calm, clear interface so you can quickly confirm what to pack and which key skills to review before leaving.',
    cards: {
      fast: { title: 'Gear library', body: 'Organize gear categories, preparation templates, and checklists by trip scenario so you can confirm what to pack faster.' },
      bilingual: { title: 'Knot skills', body: 'Start with common knots such as the adjustable tent-line knot, with use cases, steps, and practical reminders.' },
      polished: { title: 'Multi-device access', body: 'Use Web for desktop planning, Android for an installed on-the-go experience, and WeChat Mini Program for quick access inside WeChat.' }
    }
  },
  gear: {
    eyebrow: 'Gear library',
    title: 'Turn preparation into a practical checklist',
    body: 'The gear library introduces basic backpacking templates, categories, and preparation thinking. It helps people understand what to prepare before their first deeper look at the product.',
    bullets: ['Understand gear categories by use case', 'Start from templates for preparation lists', 'Browse clearly on Web, Android, and WeChat Mini Program']
  },
  skills: {
    eyebrow: 'Outdoor skills',
    title: 'Start with knots that are useful in the field',
    body: 'Outdoor skills currently focus on knots. The adjustable guyline hitch helps tune tent, tarp, and guyline tension after load is applied.',
    bullets: ['Current capability: knot tutorials', 'Example skill: adjustable guyline hitch', 'Good for quick review before departure']
  },
  screenshots: {
    eyebrow: 'Product screenshots',
    title: 'Web and WeChat Mini Program views, with Android support',
    body: 'The screenshots show Web and WeChat Mini Program views for gear and knot skills; Android supports the same gear library and outdoor skills.',
    wechatTitle: 'WeChat Mini Program',
    wechatBody: 'Open gear management and knot skills quickly inside WeChat.',
    webTitle: 'Web',
    webBody: 'Manage gear lists and add detailed gear information on a larger screen.',
    wechatGearAlt: 'WeChat Mini Program gear management interface',
    wechatKnotsAlt: 'WeChat Mini Program knot skills interface',
    webGearAlt: 'Web gear management interface',
    webGearFormAlt: 'Web add-gear form interface'
  },
  entry: {
    eyebrow: 'Download / mini program entry',
    title: 'Use StellarTrail on Web, Android, and WeChat Mini Program',
    body: 'The Web app is live and ready for browser-based gear planning. Android install and the WeChat Mini Program code will be added here when ready.',
    badge: 'Multi-platform',
    hint: 'Web is best for desktop planning, Android is ready for on-the-go use, and WeChat Mini Program opens quickly inside WeChat.',
    channelsLabel: 'Supported platform entries',
    channels: [
      {
        title: 'Web access',
        body: 'The Web app is live for planning and organizing gear on a larger screen.',
        href: 'https://app.stellartrail.cn/',
        action: 'Open Web app'
      },
      {
        title: 'Android install',
        body: 'Keep preparation content close on your phone. The install option will be added when ready.',
        href: null,
        action: null
      },
      {
        title: 'WeChat Mini Program',
        body: 'Open quickly inside WeChat. The mini program code will be added when ready.',
        href: null,
        action: null
      }
    ]
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
