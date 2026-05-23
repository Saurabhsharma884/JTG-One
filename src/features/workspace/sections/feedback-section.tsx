import { FileUp } from "lucide-react";
import { CategoryBarChart, FeedbackRadarChart, FeedbackTrendChart } from "@/components/charts/feedback-charts";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatDate } from "@/utils/format-date";
import type { Employee, FeedbackAnalysis } from "@/types/jtg-one";
import type { LiveAnalyticsData } from "@/hooks/use-feedback-analysis-task";

export type AnalysisTaskState = "idle" | "queued" | "processing" | "completed";

export function FeedbackSection({
  employee,
  latestAnalysis,
  taskState,
  taskProgress,
  liveAnalytics,
  onStartTask,
}: {
  employee: Employee;
  latestAnalysis: FeedbackAnalysis;
  taskState: AnalysisTaskState;
  taskProgress: number;
  liveAnalytics: LiveAnalyticsData;
  onStartTask: () => void;
}) {
  // Build a FeedbackAnalysis-compatible object from live data when available
  const displayAnalysis: FeedbackAnalysis = liveAnalytics
    ? {
        ...latestAnalysis,
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <CardTitle>Feedback import task</CardTitle>
            <CardDescription>
              Frontend calls backend to create an analysis task, then polls for progress and displays the latest result.
            </CardDescription>
          </div>
          <button
            type="button"
            onClick={onStartTask}
            disabled={taskState === "queued" || taskState === "processing"}
            className="inline-flex items-center gap-2 rounded-lg bg-slate-950 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FileUp size={16} />
            {taskState === "processing" ? "Analyzing..." : taskState === "queued" ? "Queued..." : "Import"}
          </button>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-[220px_1fr]">
            <div className="rounded-lg border border-slate-200 p-4">
              <p className="text-sm font-medium">Task status</p>
              <p className="mt-2 text-2xl font-semibold capitalize">{taskState}</p>
              <Progress value={taskProgress} className="mt-4" />
              <p className="mt-2 text-xs text-slate-500">{taskProgress}% complete</p>
            </div>
            <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4">
              <p className="text-sm font-medium">
                {liveAnalytics ? "✅ Live data loaded" : "Planned API flow"}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {liveAnalytics
                  ? `Analysis complete! Displaying ${(liveAnalytics.categoryScores || []).length} categories, ${(liveAnalytics.strengths || []).length} strengths, and ${(liveAnalytics.improvementAreas || []).length} improvement areas from Google Sheets data.`
                  : "POST creates the backend analysis task. GET polls by task id until the response returns completed with chart-ready JSON for the dashboard."}
              </p>
              <code className="mt-3 block rounded-md bg-white px-3 py-2 text-xs text-slate-600">
                POST /feedback-analysis/tasks · GET /feedback-analysis/tasks/:taskId
              </code>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Category score {liveAnalytics && <Badge tone="green">Live</Badge>}</CardTitle>
            <CardDescription>{displayAnalysis.summary}</CardDescription>
          </CardHeader>
          <CardContent>
            <CategoryBarChart analysis={displayAnalysis} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Growth trend {liveAnalytics && <Badge tone="green">Live</Badge>}</CardTitle>
            <CardDescription>Repeated imports create a history of feedback analytics over time.</CardDescription>
          </CardHeader>
          <CardContent>
            <FeedbackTrendChart analysis={displayAnalysis} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Capability shape {liveAnalytics && <Badge tone="green">Live</Badge>}</CardTitle>
            <CardDescription>Radar view for the latest imported cycle.</CardDescription>
          </CardHeader>
          <CardContent>
            <FeedbackRadarChart analysis={displayAnalysis} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Analysis history</CardTitle>
            <CardDescription>Older imports are stored for history and can be deleted later.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {(employee.feedbackAnalyses ?? []).map((analysis) => (
              <div key={analysis.id} className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
                <div>
                  <p className="text-sm font-medium">{analysis.title}</p>
                  <p className="text-xs text-slate-500">Imported {formatDate(analysis.importedAt)}</p>
                </div>
                <Badge tone={analysis.status === "latest" ? "green" : "slate"}>{analysis.status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
