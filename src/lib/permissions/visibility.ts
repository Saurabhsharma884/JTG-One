import type { Employee, SessionUser, VisibilityKey } from "@/types/jtg-one";

export const alwaysVisibleFields = ["name", "designation", "skills", "currentProject"] as const;

export const visibilityLabels: Record<VisibilityKey, string> = {
  pastProjects: "Past projects",
  achievements: "Achievements",
  strengths: "Strengths",
  timeline: "Timeline",
  certifications: "Certifications",
  domainExperience: "Domain experience",
  feedbackSummary: "Feedback summary",
  weaknesses: "Weaknesses",
  detailedFeedback: "Detailed feedback",
  aiGoals: "AI goals",
  managerNotes: "Manager notes",
  improvementAreas: "Improvement areas",
};

export const privateByDefault: VisibilityKey[] = [
  "weaknesses",
  "detailedFeedback",
  "aiGoals",
  "managerNotes",
  "improvementAreas",
];

export function isSelf(viewer: SessionUser, employee: Employee) {
  return viewer.id === employee.id;
}

export function canViewAnalytics(viewer: SessionUser, employee: Employee) {
  return isSelf(viewer, employee) || viewer.role === "manager";
}

export function canViewSection(viewer: SessionUser, employee: Employee, key: VisibilityKey) {
  if (isSelf(viewer, employee)) {
    return true;
  }

  if (viewer.role === "manager" && (key === "feedbackSummary" || key === "detailedFeedback")) {
    return true;
  }

  return employee.visibility[key];
}

export function canEditProfile(viewer: SessionUser, employee: Employee) {
  return isSelf(viewer, employee);
}
