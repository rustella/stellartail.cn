export const productCapabilities = [
  {
    id: 'gear',
    sectionId: 'gear',
    status: 'available',
    screenshotKey: 'androidGear'
  },
  {
    id: 'packing',
    sectionId: 'packing',
    status: 'preview',
    screenshotKey: 'androidPacking'
  },
  {
    id: 'trips',
    sectionId: 'trips',
    status: 'preview',
    screenshotKey: 'androidTrips'
  },
  {
    id: 'skills',
    sectionId: 'skills',
    status: 'available',
    screenshotKey: 'androidSkills'
  }
] as const;
export type ProductCapability = (typeof productCapabilities)[number];
export type ProductCapabilityId = ProductCapability['id'];
export type ProductCapabilityStatus = ProductCapability['status'];

export const highlightedSkill = {
  id: 'taut-line-hitch',
  category: 'knot',
  difficulty: 'beginner'
} as const;
