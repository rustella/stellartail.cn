export const productCapabilities = [
  {
    id: 'gear',
    sectionId: 'gear',
    screenshotKey: 'iosGear'
  },
  {
    id: 'packing',
    sectionId: 'packing',
    screenshotKey: 'iosPacking'
  },
  {
    id: 'trips',
    sectionId: 'trips',
    screenshotKey: 'iosTrips'
  },
  {
    id: 'skills',
    sectionId: 'skills',
    screenshotKey: 'iosSkills'
  }
] as const;
export type ProductCapability = (typeof productCapabilities)[number];
export type ProductCapabilityId = ProductCapability['id'];

export const highlightedSkill = {
  id: 'taut-line-hitch',
  category: 'knot',
  difficulty: 'beginner'
} as const;
