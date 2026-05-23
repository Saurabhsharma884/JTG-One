import { Search } from "lucide-react";
import { Avatar } from "@/components/employee/avatar";
import { InsightList } from "@/components/employee/insight-list";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { canViewAnalytics, canViewSection } from "@/lib/permissions/visibility";
import { cn } from "@/lib/utils";
import type { Employee } from "@/types/jtg-one";

export function PeopleSection({
  viewer,
  query,
  onQueryChange,
  results,
  selectedEmployee,
  onSelectEmployee,
}: {
  viewer: Employee;
  query: string;
  onQueryChange: (value: string) => void;
  results: Employee[];
  selectedEmployee: Employee;
  onSelectEmployee: (id: string) => void;
}) {
  return (
    <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
      <Card>
        <CardHeader>
          <CardTitle>Find people</CardTitle>
          <CardDescription>Search by name, designation, current project, skill, or domain.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
            <input
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder="Search React, Claims, QA..."
              className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-3 text-sm outline-none ring-slate-950/10 transition focus:ring-4"
            />
          </div>

          <div className="mt-4 space-y-2">
            {results.map((employee) => (
              <button
                key={employee.id}
                type="button"
                onClick={() => onSelectEmployee(employee.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg border p-3 text-left transition",
                  selectedEmployee.id === employee.id
                    ? "border-slate-950 bg-slate-50"
                    : "border-slate-200 hover:border-slate-300 hover:bg-slate-50",
                )}
              >
                <Avatar employee={employee} />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{employee.name}</p>
                  <p className="truncate text-xs text-slate-500">
                    {employee.designation} · {employee.currentProject}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <PublicProfile employee={selectedEmployee} viewer={viewer} />
    </div>
  );
}

function PublicProfile({ employee, viewer }: { employee: Employee; viewer: Employee }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start gap-4">
          <Avatar employee={employee} size="lg" />
          <div>
            <CardTitle>{employee.name}</CardTitle>
            <CardDescription>
              {employee.designation} · {employee.currentProject}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Always visible</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {employee.skills.map((skill) => (
              <Badge key={skill} tone="blue">
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        {canViewSection(viewer, employee, "achievements") && (
          <InsightList title="Achievements" items={employee.achievements} tone="green" />
        )}
        {canViewSection(viewer, employee, "strengths") && (
          <InsightList title="Strengths" items={employee.strengths} tone="blue" />
        )}
        {canViewAnalytics(viewer, employee) && (employee.feedbackAnalyses ?? [])[0] && (
          <div className="rounded-lg border border-slate-200 p-4">
            <p className="text-sm font-semibold">Feedback visible to this viewer</p>
            <p className="mt-2 text-sm text-slate-600">{(employee.feedbackAnalyses ?? [])[0].summary}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
