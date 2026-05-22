import { Activity, CheckCircle2, ChevronRight, Sparkles, UserRound } from "lucide-react";
import { CategoryBarChart } from "@/components/charts/feedback-charts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/ui/metric-card";
import { formatDate } from "@/utils/format-date";
import type { Employee, FeedbackAnalysis } from "@/types/jtg-one";

export function DashboardSection({
  me,
  latestAnalysis,
  onOpenFeedback,
}: {
  me: Employee;
  latestAnalysis: FeedbackAnalysis;
  onOpenFeedback: () => void;
}) {
  const completedProfileItems = 9;
  const totalProfileItems = 11;
  const completion = Math.round((completedProfileItems / totalProfileItems) * 100);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="Profile completeness" value={`${completion}%`} detail="9 of 11 sections ready" icon={UserRound} />
        <MetricCard title="Latest feedback score" value={`${latestAnalysis.overallScore}`} detail={latestAnalysis.title} icon={Activity} />
        <MetricCard title="Active skills" value={`${me.skills.length}`} detail={me.skills.slice(0, 3).join(", ")} icon={Sparkles} />
        <MetricCard title="Project ramp-up" value="4w" detail="Completed for current project" icon={CheckCircle2} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Feedback analytics snapshot</CardTitle>
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
            <CategoryBarChart analysis={latestAnalysis} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Timeline highlights</CardTitle>
            <CardDescription>Induction, ramp-up, projects, feedback, and achievements.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {me.timeline.slice(-4).map((event) => (
              <div key={event.id} className="flex gap-3">
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
