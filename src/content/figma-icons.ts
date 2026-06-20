type FigmaIconNode = readonly [
  'circle' | 'line' | 'path' | 'polyline',
  Readonly<Record<string, string>>
];

export type FigmaIconName =
  | 'arrow-right'
  | 'backpack'
  | 'book-open'
  | 'circle-check-big'
  | 'download'
  | 'file-text'
  | 'globe'
  | 'map'
  | 'shield-check';

// Mirrors the Lucide icon resource set used by the Figma Make mobile prototype.
// Source: prototypes/mobile-figma-make/node_modules/lucide-react v0.487.0.
const figmaIconNodes = {
  'arrow-right': [
    ['path', { d: 'M5 12h14' }],
    ['path', { d: 'm12 5 7 7-7 7' }]
  ],
  backpack: [
    ['path', { d: 'M4 10a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z' }],
    ['path', { d: 'M8 10h8' }],
    ['path', { d: 'M8 18h8' }],
    ['path', { d: 'M8 22v-6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v6' }],
    ['path', { d: 'M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2' }]
  ],
  'book-open': [
    ['path', { d: 'M12 7v14' }],
    ['path', { d: 'M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z' }]
  ],
  'circle-check-big': [
    ['path', { d: 'M21.801 10A10 10 0 1 1 17 3.335' }],
    ['path', { d: 'm9 11 3 3L22 4' }]
  ],
  download: [
    ['path', { d: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' }],
    ['polyline', { points: '7 10 12 15 17 10' }],
    ['line', { x1: '12', x2: '12', y1: '15', y2: '3' }]
  ],
  'file-text': [
    ['path', { d: 'M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z' }],
    ['path', { d: 'M14 2v4a2 2 0 0 0 2 2h4' }],
    ['path', { d: 'M10 9H8' }],
    ['path', { d: 'M16 13H8' }],
    ['path', { d: 'M16 17H8' }]
  ],
  globe: [
    ['circle', { cx: '12', cy: '12', r: '10' }],
    ['path', { d: 'M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20' }],
    ['path', { d: 'M2 12h20' }]
  ],
  map: [
    ['path', { d: 'M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z' }],
    ['path', { d: 'M15 5.764v15' }],
    ['path', { d: 'M9 3.236v15' }]
  ],
  'shield-check': [
    ['path', { d: 'M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z' }],
    ['path', { d: 'm9 12 2 2 4-4' }]
  ]
} satisfies Record<FigmaIconName, readonly FigmaIconNode[]>;

const escapeAttribute = (value: string): string =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');

const renderNode = ([tag, attrs]: FigmaIconNode): string => {
  const renderedAttrs = Object.entries(attrs)
    .map(([key, value]) => `${key}="${escapeAttribute(value)}"`)
    .join(' ');
  return `<${tag} ${renderedAttrs}></${tag}>`;
};

export const renderFigmaIcon = (name: FigmaIconName): string =>
  `<svg class="workbench-icon" viewBox="0 0 24 24" aria-hidden="true" data-icon-source="figma-make-lucide" data-icon-name="${name}">${figmaIconNodes[name].map(renderNode).join('')}</svg>`;
