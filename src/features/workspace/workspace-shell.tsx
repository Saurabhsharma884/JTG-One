"use client";

import { useMemo, useState } from "react";
import { AppHeader } from "@/components/layout/app-header";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { useFeedbackAnalysisTask } from "@/hooks/use-feedback-analysis-task";
import { employees, mockSession } from "@/lib/mock-data/jtg-one";
import type { SectionId } from "./navigation";
import { DashboardSection } from "./sections/dashboard-section";
import { FeedbackSection } from "./sections/feedback-section";
import { GoalsSection } from "./sections/goals-section";
import { PeopleSection } from "./sections/people-section";
import { ProfileSection } from "./sections/profile-section";
import { VisibilitySection } from "./sections/visibility-section";

export function WorkspaceShell() {
  const [activeSection, setActiveSection] = useState<SectionId>("dashboard");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("emp-001");
  const [query, setQuery] = useState("");
  const { taskState, taskProgress, startMockAnalysisTask } = useFeedbackAnalysisTask();

  const me = employees.find((employee) => employee.id === mockSession.id) ?? employees[0];
  const selectedEmployee = employees.find((employee) => employee.id === selectedEmployeeId) ?? me;
  const latestAnalysis = me.feedbackAnalyses.find((analysis) => analysis.status === "latest") ?? me.feedbackAnalyses[0];

  const searchResults = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return employees;
    }

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
  }, [query]);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
        <AppSidebar activeSection={activeSection} employee={me} onSectionChange={setActiveSection} />

        <section className="min-w-0 px-5 py-6 sm:px-8">
          <AppHeader activeSection={activeSection} role={mockSession.role} onOpenFeedback={() => setActiveSection("feedback")} />

          <div className="mt-6">
            {activeSection === "dashboard" && (
              <DashboardSection me={me} latestAnalysis={latestAnalysis} onOpenFeedback={() => setActiveSection("feedback")} />
            )}
            {activeSection === "profile" && <ProfileSection viewer={mockSession} employee={me} />}
            {activeSection === "feedback" && (
              <FeedbackSection
                employee={me}
                latestAnalysis={latestAnalysis}
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
