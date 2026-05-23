import { useEffect, useState } from "react";
import { Activity, CheckCircle2, ChevronRight, Sparkles, UserRound } from "lucide-react";
import { CategoryBarChart } from "@/components/charts/feedback-charts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/ui/metric-card";
import { formatDate } from "@/utils/format-date";
import type { Employee, FeedbackAnalysis } from "@/types/jtg-one";
import { apiClient } from "@/api/client";

import type { LiveAnalyticsData } from "@/hooks/use-feedback-analysis-task";
import { Badge } from "@/components/ui/badge";

export function DashboardSection({
  me,
  latestAnalysis,
  liveAnalytics,
  onOpenFeedback,
}: {
  me: Employee;
  latestAnalysis: FeedbackAnalysis;
  liveAnalytics?: LiveAnalyticsData;
  onOpenFeedback: () => void;
}) {
  const [dashboardData, setDashboardData] = useState<any>(null);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const data = await apiClient(`api/profile/${me.id}/dashboard`);
        setDashboardData(data);
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      }
    }
    if (me.id) fetchDashboard();
  }, [me.id]);

  const profileFields = ['name', 'email', 'designation', 'targetDesignation', 'currentProject', 'location', 'skills', 'domainExperience', 'achievements', 'strengths', 'weaknesses'];
  const completedProfileItems = profileFields.filter(field => {
    const val = me[field as keyof Employee];
    return Array.isArray(val) ? val.length > 0 : !!val;
  }).length;
  const totalProfileItems = profileFields.length;
  const completion = Math.round((completedProfileItems / totalProfileItems) * 100);

  const activeProject = (me.projects ?? [])[0];
  const rampUpValue = activeProject?.rampUp?.weeks ? `${activeProject.rampUp.weeks}w` : 'N/A';
  const rampUpDetail = activeProject?.rampUp?.status === 'completed' 
    ? 'Completed for current project' 
    : (activeProject?.rampUp?.status === 'in-progress' ? 'In progress' : 'No active project');

  // Build a FeedbackAnalysis-compatible object from live data when available
  const displayAnalysis: FeedbackAnalysis = liveAnalytics
    ? {
        ...latestAnalysis,
        title: "Live Analysis",
        overallScore: Math.round(
          (liveAnalytics.categoryScores || []).reduce((acc, c) => acc + c.score, 0) /
            Math.max(1, (liveAnalytics.categoryScores || []).length)
        ),
        summary: `AI-generated analysis from live Google Sheets data (${new Date().toLocaleDateString()})`,
        categories: (liveAnalytics.categoryScores || []).map((c) => ({
          name: c.category,
          score: c.score,
          previous: Math.max(0, c.score - 5),
          benchmark: Math.max(0, c.score - 8),
        })),
        trends: (liveAnalytics.feedbackTrend || []).map((t) => ({
          cycle: t.period,
          technical: t.score,
          ownership: Math.min(100, t.score + 3),
          communication: Math.max(0, t.score - 4),
          collaboration: Math.min(100, t.score + 1),
        })),
        strengths: liveAnalytics.strengths || latestAnalysis.strengths,
        improvements: liveAnalytics.improvementAreas || latestAnalysis.improvements,
      }
    : latestAnalysis;

  const timelineHighlights = dashboardData?.timelineHighlights || (me.timeline ?? []).slice(-4);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="Profile completeness" value={`${completion}%`} detail={`${completedProfileItems} of ${totalProfileItems} sections ready`} icon={UserRound} />
        <MetricCard title="Latest feedback score" value={`${displayAnalysis.overallScore}`} detail={displayAnalysis.title} icon={Activity} />
        <MetricCard title="Active skills" value={`${(me.skills ?? []).length}`} detail={(me.skills ?? []).slice(0, 3).join(", ")} icon={Sparkles} />
        <MetricCard title="Project ramp-up" value={rampUpValue} detail={rampUpDetail} icon={CheckCircle2} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">Feedback analytics snapshot {liveAnalytics && <Badge tone="green">Live</Badge>}</CardTitle>
              <CardDescription>Latest imported analysis shown as the main employee view.</CardDescription>
            </div>
            <button
              type="button"
              onClick={onOpenFeedback}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Open analytics
              <ChevronRight size={16} />
            </button>
          </CardHeader>
          <CardContent>
            <CategoryBarChart analysis={displayAnalysis} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Timeline highlights</CardTitle>
            <CardDescription>Induction, ramp-up, projects, feedback, and achievements.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {timelineHighlights.map((event: any) => (
              <div key={event.id || event._id} className="flex gap-3">
                <div className="mt-1 size-2 rounded-full bg-slate-950" />
                <div>
                  <p className="text-sm font-medium">{event.title}</p>
                  <p className="text-xs text-slate-500">{formatDate(event.date)}</p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{event.description}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
