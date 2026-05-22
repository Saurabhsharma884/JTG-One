import { Eye, EyeOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { visibilityLabels } from "@/lib/permissions/visibility";
import type { Employee, VisibilityKey } from "@/types/jtg-one";

export function VisibilitySection({ employee }: { employee: Employee }) {
  const keys = Object.keys(employee.visibility) as VisibilityKey[];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile visibility controls</CardTitle>
        <CardDescription>
          Name, designation, skills, and current project stay visible. Other profile sections can be shared or kept private.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {keys.map((key) => {
          const visible = employee.visibility[key];
          return (
            <div key={key} className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
              <div>
                <p className="text-sm font-medium">{visibilityLabels[key]}</p>
                <p className="mt-1 text-xs text-slate-500">{visible ? "Visible on shared profile" : "Private by default"}</p>
              </div>
              <Badge tone={visible ? "green" : "slate"} className="gap-1.5">
                {visible ? <Eye size={13} /> : <EyeOff size={13} />}
                {visible ? "On" : "Off"}
              </Badge>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
