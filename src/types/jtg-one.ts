export type UserRole = "employee" | "manager";

export type VisibilityKey =
  | "pastProjects"
  | "achievements"
  | "strengths"
  | "timeline"
  | "certifications"
  | "domainExperience"
  | "feedbackSummary"
  | "weaknesses"
  | "detailedFeedback"
  | "aiGoals"
  | "managerNotes"
  | "improvementAreas";

export type VisibilitySettings = Record<VisibilityKey, boolean>;

export type Project = {
  id: string;
  name: string;
  role: string;
  domain: string;
  duration: string;
  impact: string;
  techStack: string[];
  rampUp: {
    status: "completed" | "in-progress";
    weeks: number;
    notes: string;
  };
};

export type TimelineEvent = {
  id: string;
  date: string;
  type:
    | "induction"
    | "project"
    | "ramp-up"
    | "feedback"
    | "achievement"
    | "skill"
    | "designation";
  title: string;
  description: string;
};

export type FeedbackCategory = {
  name: string;
  score: number;
  previous: number;
  benchmark: number;
};

export type FeedbackTrendPoint = {
  cycle: string;
  technical: number;
  ownership: number;
  communication: number;
  collaboration: number;
};

export type FeedbackAnalysis = {
  id: string;
  title: string;
  importedAt: string;
  status: "latest" | "archived";
  overallScore: number;
  sentiment: "positive" | "mixed" | "needs-attention";
  summary: string;
  categories: FeedbackCategory[];
  trends: FeedbackTrendPoint[];
  strengths: string[];
  improvements: string[];
};

export type GoalSuggestion = {
  id: string;
  title: string;
  priority: "high" | "medium" | "low";
  description: string;
  timeframe: string;
  evidence: string;
};

export type Employee = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  designation: string;
  targetDesignation: string;
  currentProject: string;
  location: string;
  avatarInitials: string;
  skills: string[];
  domainExperience: string[];
  achievements: string[];
  strengths: string[];
  weaknesses: string[];
  improvementAreas: string[];
  managerNotes: string[];
  certifications: string[];
  projects: Project[];
  timeline: TimelineEvent[];
  visibility: VisibilitySettings;
  feedbackAnalyses: FeedbackAnalysis[];
  goalSuggestions: GoalSuggestion[];
};

export type SessionUser = {
  id: string;
  name: string;
  role: UserRole;
};
