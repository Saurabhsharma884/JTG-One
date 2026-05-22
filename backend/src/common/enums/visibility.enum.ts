export enum VisibilityLevel {
  PUBLIC = 'public',
  SHARED = 'shared',
  PRIVATE = 'private',
}

export const ALWAYS_VISIBLE_FIELDS = ['name', 'designation', 'skills', 'currentProject'] as const;
export const CONFIGURABLE_FIELDS = ['pastProjects', 'achievements', 'strengths', 'timelineDetails', 'certifications', 'domainExperience', 'feedbackSummary'] as const;
export const ALWAYS_PRIVATE_FIELDS = ['weaknesses', 'detailedFeedback', 'aiGoals', 'managerNotes', 'improvementAreas'] as const;
