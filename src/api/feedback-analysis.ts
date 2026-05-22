export type FeedbackAnalysisTaskResponse = {
  taskId: string;
  status: "queued" | "processing" | "completed" | "failed";
  progress: number;
};

export function getFeedbackAnalysisTaskUrl(taskId: string) {
  return `/feedback-analysis/tasks/${taskId}`;
}

export const feedbackAnalysisTaskEndpoint = "/feedback-analysis/tasks";
