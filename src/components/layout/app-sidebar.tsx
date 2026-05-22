import { ShieldCheck } from "lucide-react";
import { Avatar } from "@/components/employee/avatar";
import { navItems, type SectionId } from "@/features/workspace/navigation";
import { cn } from "@/lib/utils";
import type { Employee } from "@/types/jtg-one";

export function AppSidebar({
  activeSection,
  employee,
  onSectionChange,
}: {
  activeSection: SectionId;
  employee: Employee;
  onSectionChange: (section: SectionId) => void;
}) {
  return (
    <aside className="border-r border-slate-200 bg-white px-5 py-6">
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-lg bg-slate-950 text-sm font-bold text-white">
          J1
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-950">JTG One</p>
          <p className="text-xs text-slate-500">Growth intelligence</p>
        </div>
      </div>

      <nav className="mt-8 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSectionChange(item.id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition",
                isActive ? "bg-slate-950 text-white" : "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
              )}
            >
              <Icon size={18} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="mt-8 rounded-lg border border-slate-200 bg-slate-50 p-4">
        <div className="flex items-center gap-3">
          <Avatar employee={employee} />
          <div>
            <p className="text-sm font-semibold">{employee.name}</p>
            <p className="text-xs text-slate-500">{employee.designation}</p>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
          <ShieldCheck size={14} />
          Mocked auth session
        </div>
      </div>
    </aside>
  );
}
