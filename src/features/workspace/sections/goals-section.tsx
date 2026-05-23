import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Employee } from "@/types/jtg-one";
import { apiClient } from "@/api/client";

export function GoalsSection({ employee }: { employee: Employee }) {
  const [suggestionData, setSuggestionData] = useState<any>(null);

  useEffect(() => {
    async function fetchSuggestion() {
      try {
        const data = await apiClient(`api/ai/suggestions/${employee.id}`);
        setSuggestionData(data);
      } catch (err) {
        console.error("Failed to fetch AI suggestions", err);
      }
    }
    fetchSuggestion();
  }, [employee.id]);

  const targetDesignation = suggestionData?.targetDesignation || employee.targetDesignation;

  return (
    <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
      <Card>
        <CardHeader>
          <CardTitle>Career direction</CardTitle>
          <CardDescription>AI-generated progression mapping based on your current role and skills.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg bg-slate-950 p-5 text-white">
            <p className="text-sm text-slate-300">Current designation</p>
            <p className="mt-1 text-xl font-semibold">{employee.designation}</p>
            <div className="my-5 h-px bg-white/15" />
            <p className="text-sm text-slate-300">Target designation</p>
            <p className="mt-1 text-xl font-semibold">{targetDesignation}</p>
          </div>
          
          {suggestionData?.reasoningSummary && (
            <div className="mt-6 rounded-lg border border-slate-200 p-4">
              <h4 className="text-sm font-semibold text-slate-900">Why this path?</h4>
              <p className="mt-2 text-sm text-slate-600">{suggestionData.reasoningSummary}</p>
            </div>
          )}

          {Array.isArray(suggestionData?.skillGaps) && suggestionData.skillGaps.length > 0 && (
            <div className="mt-6">
              <h4 className="text-sm font-semibold text-slate-900">Identified Skill Gaps</h4>
              <div className="mt-3 flex flex-col gap-3">
                {suggestionData.skillGaps.map((gap: any, idx: number) => (
                  <div key={idx} className="flex flex-col gap-1 rounded-md bg-slate-50 p-3">
                    <span className="text-sm font-medium">{gap.skill || gap.name || JSON.stringify(gap)}</span>
                    {(gap.currentLevel || gap.requiredLevel) && (
                      <span className="text-xs text-slate-500">
                        {gap.currentLevel && `Current: ${gap.currentLevel}`}
                        {gap.currentLevel && gap.requiredLevel && ' → '}
                        {gap.requiredLevel && `Required: ${gap.requiredLevel}`}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>AI-backed suggestions</CardTitle>
          <CardDescription>Goals, recommended actions, and next-step evidence tailored to your profile.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {(employee.goalSuggestions || []).map((goal) => (
            <div key={goal.id} className="rounded-lg border border-slate-200 p-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="font-semibold">{goal.title}</h3>
                <Badge tone={goal.priority === "high" ? "rose" : "amber"}>{goal.priority}</Badge>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600">{goal.description}</p>
              <p className="mt-3 text-xs font-medium text-slate-500">{goal.timeframe}</p>
              <p className="mt-2 text-xs leading-5 text-slate-500">{goal.evidence}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
