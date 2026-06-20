export const productCapabilities = [
  {
    id: 'gear',
    sectionId: 'gear',
    screenshotKey: 'androidGear'
  },
  {
    id: 'packing',
    sectionId: 'packing',
    screenshotKey: 'androidPacking'
  },
  {
    id: 'trips',
    sectionId: 'trips',
    screenshotKey: 'androidTrips'
  },
  {
    id: 'skills',
    sectionId: 'skills',
    screenshotKey: 'androidSkills'
  }
] as const;
export type ProductCapability = (typeof productCapabilities)[number];
export type ProductCapabilityId = ProductCapability['id'];

export const highlightedSkill = {
  id: 'taut-line-hitch',
  category: 'knot',
  difficulty: 'beginner'
} as const;
