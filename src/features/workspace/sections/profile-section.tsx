import { useEffect, useState } from "react";
import { Avatar } from "@/components/employee/avatar";
import { InsightList } from "@/components/employee/insight-list";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { canViewSection } from "@/lib/permissions/visibility";
import type { Employee, SessionUser } from "@/types/jtg-one";
import { apiClient } from "@/api/client";

export function ProfileSection({ viewer, employee: initialEmployee }: { viewer: SessionUser; employee: Employee }) {
  const [employee, setEmployee] = useState<Employee>(initialEmployee);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const data = await apiClient<any>(`api/profile/${initialEmployee.id}`);
        if (data) {
          setEmployee((prev) => ({
            ...prev,
            ...initialEmployee,
            ...data,
            id: data.id || data._id?.toString() || initialEmployee.id,
            visibility: data.visibility || data.visibilitySettings || initialEmployee.visibility,
          }));
        }
      } catch (err) {
        console.error("Failed to fetch profile data", err);
      }
    }
    fetchProfile();
  }, [initialEmployee.id]);

  return (
    <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
      <Card>
        <CardContent>
          <div className="flex items-start gap-4">
            <Avatar employee={employee} size="lg" />
            <div>
              <h2 className="text-xl font-semibold">{employee.name}</h2>
              <p className="text-sm text-slate-500">{employee.designation}</p>
              <p className="mt-2 text-sm text-slate-600">
                {employee.currentProject} · {employee.location}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Skills</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {(employee.skills || []).map((skill) => (
                <Badge key={skill} tone="blue">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          {canViewSection(viewer, employee, "domainExperience") && (
            <div className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Domain experience</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {(employee.domainExperience || []).map((domain) => (
                  <Badge key={domain}>{domain}</Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Project journey</CardTitle>
            <CardDescription>Past work, role context, technology exposure, and ramp-up notes.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            {(employee.projects || []).map((project) => (
              <div key={project.id} className="rounded-lg border border-slate-200 p-4">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-semibold">{project.name}</h3>
                  {project.rampUp?.status && <Badge tone="green">{project.rampUp.status}</Badge>}
                </div>
                <p className="mt-1 text-sm text-slate-500">
                  {project.role} · {project.duration}
                </p>
                <p className="mt-3 text-sm leading-6 text-slate-600">{project.impact}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(project.techStack || []).map((tech) => (
                    <Badge key={tech}>{tech}</Badge>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Strengths and achievements</CardTitle>
            <CardDescription>Configurable sections in public profiles, fully visible to the owner.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <InsightList title="Strengths" items={employee.strengths || []} tone="green" />
            <InsightList title="Achievements" items={employee.achievements || []} tone="blue" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
