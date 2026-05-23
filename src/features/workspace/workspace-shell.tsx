"use client";

import { useMemo, useState } from "react";
import { AppHeader } from "@/components/layout/app-header";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { useFeedbackAnalysisTask } from "@/hooks/use-feedback-analysis-task";
import { useEmployees, useDashboardData } from "@/hooks/use-employee-data";
import type { Employee, FeedbackAnalysis, GoalSuggestion, SessionUser, TimelineEvent, VisibilitySettings } from "@/types/jtg-one";
import type { SectionId } from "./navigation";
import { DashboardSection } from "./sections/dashboard-section";
import { FeedbackSection } from "./sections/feedback-section";
import { GoalsSection } from "./sections/goals-section";
import { PeopleSection } from "./sections/people-section";
import { ProfileSection } from "./sections/profile-section";
import { VisibilitySection } from "./sections/visibility-section";

// ── Data transformers ────────────────────────────────────────────────
// The backend returns normalised MongoDB documents. These helpers
// convert them into the `Employee` shape the section components
// already understand, so we don't need to touch any section code.

function toTimelineEvent(raw: any): TimelineEvent {
  const typeMap: Record<string, TimelineEvent["type"]> = {
    joining: "induction",
    project_assignment: "project",
    rampup_milestone: "ramp-up",
    feedback_import: "feedback",
    achievement: "achievement",
    skill_update: "skill",
    designation_change: "designation",
  };

  return {
    id: raw._id,
    date: raw.date?.slice?.(0, 10) ?? new Date(raw.date).toISOString().slice(0, 10),
    type: typeMap[raw.type] ?? "project",
    title: raw.title,
    description: raw.description,
  };
}

function toFeedbackAnalysis(raw: any): FeedbackAnalysis {
  const ad = raw.analyticsData ?? {};
  const rd = ad.rawData ?? {};

  const categories = (ad.categoryScores ?? []).map((c: any) => {
    const prev = rd.previousScores?.[c.category] ?? 0;
    const bench = rd.benchmarks?.[c.category] ?? 0;
    return { name: c.category, score: c.score, previous: prev, benchmark: bench };
  });

  const trends = (rd.trends ?? []).map((t: any) => ({
    cycle: t.cycle ?? t.period ?? "",
    technical: t.technical ?? 0,
    ownership: t.ownership ?? 0,
    communication: t.communication ?? 0,
    collaboration: t.collaboration ?? 0,
  }));

  return {
    id: raw._id,
    title: raw.label,
    importedAt: new Date(raw.importedAt).toISOString().slice(0, 10),
    status: raw.isLatest ? "latest" : "archived",
    overallScore: rd.overallScore ?? 0,
    sentiment: rd.sentiment ?? "mixed",
    summary: rd.summary ?? "",
    categories,
    trends,
    strengths: ad.strengths ?? [],
    improvements: ad.improvementAreas ?? [],
  };
}

function toGoalSuggestion(raw: any): GoalSuggestion[] {
  if (!raw) return [];
  return (raw.suggestedGoals ?? []).map((title: string, i: number) => {
    const gap = raw.skillGaps?.[i];
    return {
      id: `goal-${i}`,
      title,
      priority: i === 0 ? "high" : "medium",
      description: gap ? `Gap: ${gap.skill} from ${gap.currentLevel} to ${gap.requiredLevel}` : title,
      timeframe: raw.timelineForImprovement ?? "This quarter",
      evidence: raw.reasoningSummary ?? "",
    } as GoalSuggestion;
  });
}

const defaultVisibility: VisibilitySettings = {
  pastProjects: true,
  achievements: true,
  strengths: true,
  timeline: true,
  certifications: true,
  domainExperience: true,
  feedbackSummary: false,
  weaknesses: false,
  detailedFeedback: false,
  aiGoals: false,
  managerNotes: false,
  improvementAreas: false,
};

function toVisibility(raw: any): VisibilitySettings {
  if (!raw) return defaultVisibility;
  return {
    pastProjects: raw.pastProjects === "public",
    achievements: raw.achievements === "public",
    strengths: raw.strengths === "public",
    timeline: (raw.timelineDetails ?? raw.timeline) !== "private",
    certifications: raw.certifications === "public",
    domainExperience: raw.domainExperience === "public",
    feedbackSummary: raw.feedbackSummary === "public",
    weaknesses: false,
    detailedFeedback: false,
    aiGoals: false,
    managerNotes: false,
    improvementAreas: false,
  };
}

function toEmployee(
  profile: any,
  timeline: any[],
  feedbackAnalyses: any[],
  aiSuggestions: any[],
): Employee {
  return {
    id: profile._id,
    name: profile.name,
    email: profile.email,
    role: profile.role === "champion" ? "manager" : "employee",
    designation: profile.designation ?? "",
    targetDesignation: aiSuggestions?.[0]?.targetDesignation ?? "",
    currentProject: profile.currentProject ?? "",
    location: "",
    avatarInitials: (profile.name ?? "")
      .split(" ")
      .map((w: string) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2),
    skills: profile.skills ?? [],
    domainExperience: profile.domainExperience ?? [],
    achievements: profile.achievements ?? [],
    strengths: profile.strengths ?? [],
    weaknesses: profile.weaknesses ?? [],
    improvementAreas: profile.improvementAreas ?? [],
    managerNotes: profile.managerNotes ? [profile.managerNotes] : [],
    certifications: profile.certifications ?? [],
    projects: (profile.pastProjects ?? []).map((name: string, i: number) => ({
      id: `proj-${i}`,
      name,
      role: "",
      domain: "",
      duration: "",
      impact: "",
      techStack: [],
      rampUp: { status: "completed" as const, weeks: 0, notes: "" },
    })),
    timeline: (timeline ?? []).map(toTimelineEvent),
    visibility: toVisibility(profile.visibilitySettings),
    feedbackAnalyses: (feedbackAnalyses ?? []).map(toFeedbackAnalysis),
    goalSuggestions: toGoalSuggestion(aiSuggestions?.[0]),
  };
}

function toEmployeeFromList(raw: any): Employee {
  return toEmployee(raw, [], [], []);
}

// ── Shell ────────────────────────────────────────────────────────────
export function WorkspaceShell() {
  const [activeSection, setActiveSection] = useState<SectionId>("dashboard");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const { taskState, taskProgress, startMockAnalysisTask } = useFeedbackAnalysisTask();

  // Fetch all employees (for People section + determining current user)
  const { data: rawEmployees, isLoading: employeesLoading } = useEmployees();

  const employees: Employee[] = useMemo(
    () => (rawEmployees ?? []).map(toEmployeeFromList),
    [rawEmployees],
  );

  // The first employee acts as the logged-in user
  const currentUserId = employees[0]?.id;
  const currentSession: SessionUser = useMemo(
    () => ({
      id: currentUserId ?? "",
      name: employees[0]?.name ?? "",
      role: employees[0]?.role ?? "employee",
    }),
    [currentUserId, employees],
  );

  // Fetch full dashboard data for the current user (includes timeline, feedback, AI goals)
  const { data: dashboardRaw } = useDashboardData(currentUserId);

  const me: Employee | undefined = useMemo(() => {
    if (!dashboardRaw) return employees[0];
    return toEmployee(
      dashboardRaw.profile,
      dashboardRaw.timeline,
      dashboardRaw.feedbackAnalyses,
      dashboardRaw.aiSuggestions,
    );
  }, [dashboardRaw, employees]);

  // Fetch dashboard data for the selected employee in People section
  const selectedId = selectedEmployeeId ?? currentUserId;
  const { data: selectedDashRaw } = useDashboardData(
    selectedId !== currentUserId ? selectedId : undefined,
  );

  const selectedEmployee: Employee | undefined = useMemo(() => {
    if (selectedId === currentUserId) return me;
    if (!selectedDashRaw) {
      return employees.find((e) => e.id === selectedId) ?? me;
    }
    return toEmployee(
      selectedDashRaw.profile,
      selectedDashRaw.timeline,
      selectedDashRaw.feedbackAnalyses,
      selectedDashRaw.aiSuggestions,
    );
  }, [selectedId, currentUserId, selectedDashRaw, employees, me]);

  const latestAnalysis = me?.feedbackAnalyses?.find((a) => a.status === "latest") ?? me?.feedbackAnalyses?.[0];

  const searchResults = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return employees;
    return employees.filter((employee) => {
      const haystack = [
        employee.name,
        employee.designation,
        employee.currentProject,
        ...employee.skills,
        ...employee.domainExperience,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(normalized);
    });
  }, [query, employees]);

  // ── Loading state ──────────────────────────────────────────────────
  if (employeesLoading || !me) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto mb-4 size-10 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />
          <p className="text-sm text-slate-500">Loading workspace…</p>
        </div>
      </main>
    );
  }

  // ── Fallback analysis for when no feedback exists yet ──────────────
  const safeAnalysis: import("@/types/jtg-one").FeedbackAnalysis = latestAnalysis ?? {
    id: "placeholder",
    title: "No feedback imported yet",
    importedAt: new Date().toISOString().slice(0, 10),
    status: "latest",
    overallScore: 0,
    sentiment: "mixed",
    summary: "Import feedback from your performance cycle to see analytics here.",
    categories: [],
    trends: [],
    strengths: [],
    improvements: [],
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
        <AppSidebar activeSection={activeSection} employee={me} onSectionChange={setActiveSection} />

        <section className="min-w-0 px-5 py-6 sm:px-8">
          <AppHeader activeSection={activeSection} role={currentSession.role} onOpenFeedback={() => setActiveSection("feedback")} />

          <div className="mt-6">
            {activeSection === "dashboard" && (
              <DashboardSection me={me} latestAnalysis={safeAnalysis} onOpenFeedback={() => setActiveSection("feedback")} />
            )}
            {activeSection === "profile" && <ProfileSection viewer={currentSession} employee={me} />}
            {activeSection === "feedback" && (
              <FeedbackSection
                employee={me}
                latestAnalysis={safeAnalysis}
                taskState={taskState}
                taskProgress={taskProgress}
                onStartTask={startMockAnalysisTask}
              />
            )}
            {activeSection === "goals" && <GoalsSection employee={me} />}
            {activeSection === "people" && (
              <PeopleSection
                query={query}
                onQueryChange={setQuery}
                results={searchResults}
                selectedEmployee={selectedEmployee ?? me}
                onSelectEmployee={setSelectedEmployeeId}
              />
            )}
            {activeSection === "visibility" && <VisibilitySection employee={me} />}
          </div>
        </section>
      </div>
    </main>
  );
}
