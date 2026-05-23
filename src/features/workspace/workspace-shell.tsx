"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { AppHeader } from "@/components/layout/app-header";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { useFeedbackAnalysisTask } from "@/hooks/use-feedback-analysis-task";
import { apiClient } from "@/api/client";
import type { Employee, FeedbackAnalysis } from "@/types/jtg-one";
import type { SectionId } from "./navigation";
import { DashboardSection } from "./sections/dashboard-section";
import { FeedbackSection } from "./sections/feedback-section";
import { GoalsSection } from "./sections/goals-section";
import { PeopleSection } from "./sections/people-section";
import { ProfileSection } from "./sections/profile-section";
import { VisibilitySection } from "./sections/visibility-section";

const DEFAULT_VISIBILITY: Employee["visibility"] = {
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
export function WorkspaceShell() {
  const [activeSection, setActiveSection] = useState<SectionId>("dashboard");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [meId, setMeId] = useState("");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newEmployeeName, setNewEmployeeName] = useState("");
  const [newEmployeeEmail, setNewEmployeeEmail] = useState("");
  const [creatingEmployee, setCreatingEmployee] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const { taskState, taskProgress, liveAnalytics, startAnalysisTask } = useFeedbackAnalysisTask();

  const normalizeEmployee = useCallback((payload: Partial<Employee> & { id?: string; _id?: string }): Employee => ({
    id: payload._id?.toString() || payload.id || `${payload.email ?? "unknown"}-${Date.now()}`,
    name: payload.name ?? "Unknown",
    email: payload.email ?? `unknown-${Date.now()}@example`,
    role: payload.role ?? "employee",
    designation: payload.designation ?? "",
    targetDesignation: payload.targetDesignation ?? "",
    currentProject: payload.currentProject ?? "",
    location: payload.location ?? "",
    avatarInitials:
      payload.avatarInitials ||
      (payload.name ?? "").split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase(),
    skills: payload.skills ?? [],
    domainExperience: payload.domainExperience ?? [],
    achievements: payload.achievements ?? [],
    strengths: payload.strengths ?? [],
    weaknesses: payload.weaknesses ?? [],
    improvementAreas: payload.improvementAreas ?? [],
    managerNotes: payload.managerNotes ?? [],
    certifications: payload.certifications ?? [],
    projects: payload.projects ?? [],
    timeline: payload.timeline ?? [],
    visibility: payload.visibility ?? DEFAULT_VISIBILITY,
    feedbackAnalyses: payload.feedbackAnalyses ?? [],
    goalSuggestions: payload.goalSuggestions ?? [],
  }), []);

  useEffect(() => {
    async function loadEmployees() {
      setIsLoading(true);
      setLoadError(null);

      try {
        const data = await apiClient<Employee[] | null>("api/employees");
        if (!Array.isArray(data) || data.length === 0) {
          setEmployees([]);
          return;
        }

        const normalized = data.map((d) => normalizeEmployee(d as Partial<Employee>));
        setEmployees(normalized);
        setMeId((prev) => prev || (normalized[0]?.id ?? ""));
        setSelectedEmployeeId((prev) => prev || (normalized[0]?.id ?? ""));
      } catch (error) {
        console.error("Failed to load employees", error);
        setLoadError("Unable to load employee data from the API.");
      } finally {
        setIsLoading(false);
      }
    }

    loadEmployees();
  }, [normalizeEmployee]);

  // When live analytics are produced, refresh employee data to pick up AI-generated goal suggestions
  useEffect(() => {
    if (!liveAnalytics) return;

    let cancelled = false;
    async function refreshEmployees() {
      try {
        const data = await apiClient<Employee[] | null>("api/employees");
        if (!Array.isArray(data)) return;
        const normalized = data.map((d) => normalizeEmployee(d as Partial<Employee>));
        if (!cancelled) setEmployees(normalized);
      } catch (err) {
        console.warn("Failed to refresh employees after analysis:", err);
      }
    }

    refreshEmployees();
    const retry = window.setTimeout(() => refreshEmployees(), 2500);
    return () => {
      cancelled = true;
      window.clearTimeout(retry);
    };
  }, [liveAnalytics, normalizeEmployee]);

  const me = employees.find((employee) => employee.id === meId) ?? employees[0];
  const selectedEmployee = employees.find((employee) => employee.id === selectedEmployeeId) ?? me ?? employees[0];

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

  const handleCreateEmployee = async () => {
    setCreateError(null);
    setCreatingEmployee(true);

    try {
      const payload = {
        name: newEmployeeName,
        email: newEmployeeEmail,
        role: "employee" as const,
      };

      const created = await apiClient<Partial<Employee>>("api/employees", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const employee = normalizeEmployee({ ...created, ...payload });
      setEmployees([employee]);
      setMeId(employee.id);
      setSelectedEmployeeId(employee.id);
      setShowCreateForm(false);
      setNewEmployeeName("");
      setNewEmployeeEmail("");
      startAnalysisTask(employee.id);
    } catch (error) {
      console.error("Failed to create employee", error);
      setCreateError("Unable to create employee. Check the API and try again.");
    } finally {
      setCreatingEmployee(false);
    }
  };

  const hasEmployees = employees.length > 0;

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-950">
        <div className="p-8 text-slate-700">Loading workspace...</div>
      </main>
    );
  }

  if (loadError) {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-950">
        <div className="mx-auto max-w-2xl p-8 text-slate-700">
          <h1 className="text-2xl font-semibold">Unable to load workspace</h1>
          <p className="mt-3 text-slate-600">{loadError}</p>
          <p className="mt-3 text-sm text-slate-500">
            Confirm your backend is running and that {process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"} is reachable.
          </p>
        </div>
      </main>
    );
  }

  if (!hasEmployees) {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-950">
        <div className="mx-auto max-w-3xl p-8">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h1 className="text-3xl font-semibold text-slate-950">Welcome to the Employee Dashboard</h1>
            <p className="mt-3 text-slate-600">
              No employees were found in the backend. Create a new employee profile to start the dashboard and trigger AI feedback analysis.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-slate-500">Add a new employee to continue.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="inline-flex items-center justify-center rounded-lg bg-slate-950 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
              >
                {showCreateForm ? "Hide form" : "Enter employee details"}
              </button>
            </div>

            {showCreateForm && (
              <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-slate-700">Name</span>
                    <input
                      value={newEmployeeName}
                      onChange={(event) => setNewEmployeeName(event.target.value)}
                      placeholder="Aarav Mehta"
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-950 focus:ring-2 focus:ring-slate-200"
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-slate-700">Email</span>
                    <input
                      value={newEmployeeEmail}
                      onChange={(event) => setNewEmployeeEmail(event.target.value)}
                      placeholder="aarav.mehta@jtg.example"
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-950 focus:ring-2 focus:ring-slate-200"
                    />
                  </label>
                </div>

                {createError && <p className="mt-4 text-sm text-rose-600">{createError}</p>}

                <button
                  type="button"
                  onClick={handleCreateEmployee}
                  disabled={creatingEmployee || !newEmployeeName || !newEmployeeEmail}
                  className="mt-6 inline-flex items-center justify-center rounded-lg bg-slate-950 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {creatingEmployee ? "Creating employee..." : "Create employee and start analysis"}
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    );
  }

  if (!me) {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-950">
        <div className="p-8 text-slate-700">No workspace data available.</div>
      </main>
    );
  }


  const analyses: FeedbackAnalysis[] = me.feedbackAnalyses ?? [];

  const defaultAnalysis: FeedbackAnalysis = {
    id: "none",
    title: "No feedback imported",
    importedAt: new Date().toISOString().slice(0, 10),
    status: "archived",
    overallScore: 0,
    sentiment: "mixed",
    summary: "No feedback data available. Use Import to fetch analyses from the backend.",
    categories: [],
    trends: [],
    strengths: [],
    improvements: [],
  };

  const latestAnalysis: FeedbackAnalysis = (analyses.find((analysis) => analysis.status === "latest") ?? analyses[0]) ?? defaultAnalysis;

  

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
        <AppSidebar activeSection={activeSection} employee={me} onSectionChange={setActiveSection} />

        <section className="min-w-0 px-5 py-6 sm:px-8">
          <AppHeader activeSection={activeSection} role={me.role} onOpenFeedback={() => setActiveSection("feedback")} />

          <div className="mt-6">
            {activeSection === "dashboard" && (
              <DashboardSection me={me} latestAnalysis={latestAnalysis} liveAnalytics={liveAnalytics} onOpenFeedback={() => setActiveSection("feedback")} />
            )}
            {activeSection === "profile" && <ProfileSection viewer={me} employee={me} />}
            {activeSection === "feedback" && (
              <FeedbackSection
                employee={me}
                latestAnalysis={latestAnalysis}
                taskState={taskState}
                taskProgress={taskProgress}
                liveAnalytics={liveAnalytics}
                onStartTask={() => startAnalysisTask(me.id)}
              />
            )}
            {activeSection === "goals" && <GoalsSection employee={me} />}
            {activeSection === "people" && (
              <PeopleSection
                viewer={me}
                query={query}
                onQueryChange={setQuery}
                results={searchResults}
                selectedEmployee={selectedEmployee}
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
