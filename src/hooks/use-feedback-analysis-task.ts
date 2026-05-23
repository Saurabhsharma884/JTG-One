import { useState, useRef, useCallback } from "react";
import type { AnalysisTaskState } from "@/features/workspace/sections/feedback-section";
import { apiClient } from "@/api/client";

export type LiveAnalyticsData = {
  categoryScores?: { category: string; score: number }[];
  feedbackTrend?: { period: string; score: number }[];
  skillRatings?: { skill: string; rating: number }[];
  strengths?: string[];
  improvementAreas?: string[];
  radarData?: { axis: string; value: number }[];
} | null;

export function useFeedbackAnalysisTask() {
  const [taskState, setTaskState] = useState<AnalysisTaskState>("idle");
  const [taskProgress, setTaskProgress] = useState(0);
  const [liveAnalytics, setLiveAnalytics] = useState<LiveAnalyticsData>(null);
  const intervalRef = useRef<number | null>(null);

  const startAnalysisTask = useCallback(async (employeeId: string) => {
    try {
      setTaskState("queued");
      setTaskProgress(10);
      setLiveAnalytics(null);

      console.log("[FeedbackTask] POST to create task for employee:", employeeId);

      const result = await apiClient<{
        taskId: string;
        status: string;
        progress: number;
      }>("api/feedback-analysis/tasks", {
        method: "POST",
        body: JSON.stringify({ employeeId }),
      });

      console.log("[FeedbackTask] Task created:", result);
      setTaskProgress(result.progress);
      setTaskState(result.status as AnalysisTaskState);

      intervalRef.current = window.setInterval(async () => {
        try {
          const statusResult = await apiClient<{
            taskId: string;
            status: string;
            progress: number;
            feedbackImportId?: string;
            analyticsData?: any;
            errorMessage?: string;
          }>(`api/feedback-analysis/tasks/${result.taskId}`);

          console.log("[FeedbackTask] Poll status:", statusResult.status, statusResult.progress + "%");
          setTaskProgress(statusResult.progress);
          setTaskState(statusResult.status as AnalysisTaskState);

          if (statusResult.status === "completed") {
            if (intervalRef.current) {
              window.clearInterval(intervalRef.current);
              intervalRef.current = null;
            }

            // Use analyticsData from the task status response directly
            if (statusResult.analyticsData) {
              console.log("[FeedbackTask] Received analyticsData from task:", Object.keys(statusResult.analyticsData));
              setLiveAnalytics(statusResult.analyticsData);
            } else if (statusResult.feedbackImportId) {
              // Fallback: fetch from the feedback endpoint
              console.log("[FeedbackTask] Fetching feedback from DB, feedbackImportId:", statusResult.feedbackImportId);
              try {
                const feedbackResult = await apiClient<any>(`api/feedback/latest/${employeeId}`);
                console.log("[FeedbackTask] Fetched feedback from DB:", feedbackResult);
                if (feedbackResult?.analyticsData) {
                  setLiveAnalytics(feedbackResult.analyticsData);
                }
              } catch (fetchErr) {
                console.error("[FeedbackTask] Failed to fetch feedback from DB:", fetchErr);
              }
            }
          }

          if (statusResult.status === "failed") {
            console.error("[FeedbackTask] Task failed:", statusResult.errorMessage);
            if (intervalRef.current) {
              window.clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
          }
        } catch (e) {
          console.error("[FeedbackTask] Poll error:", e);
        }
      }, 1500);
    } catch (error) {
      console.error("[FeedbackTask] Failed to create task:", error);
      setTaskState("idle");
    }
  }, []);

  return {
    taskState,
    taskProgress,
    liveAnalytics,
    startAnalysisTask,
  };
}
