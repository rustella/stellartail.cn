export const productCapabilities = ['gear', 'knots'] as const;
export type ProductCapability = (typeof productCapabilities)[number];

export const highlightedSkill = {
  id: 'taut-line-hitch',
  category: 'knot',
  difficulty: 'beginner'
} as const;
