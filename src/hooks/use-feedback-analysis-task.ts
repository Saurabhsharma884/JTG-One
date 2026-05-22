import { useState } from "react";
import type { AnalysisTaskState } from "@/features/workspace/sections/feedback-section";

export function useFeedbackAnalysisTask() {
  const [taskState, setTaskState] = useState<AnalysisTaskState>("idle");
  const [taskProgress, setTaskProgress] = useState(0);

  function startMockAnalysisTask() {
    setTaskState("queued");
    setTaskProgress(8);

    window.setTimeout(() => {
      setTaskState("processing");
      setTaskProgress(42);
    }, 700);

    window.setTimeout(() => {
      setTaskProgress(78);
    }, 1500);

    window.setTimeout(() => {
      setTaskState("completed");
      setTaskProgress(100);
    }, 2300);
  }

  return {
    taskState,
    taskProgress,
    startMockAnalysisTask,
  };
}
