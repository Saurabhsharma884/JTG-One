import { FileUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { sectionTitle, type SectionId } from "@/features/workspace/navigation";
import type { UserRole } from "@/types/jtg-one";

export function AppHeader({
  activeSection,
  role,
  onOpenFeedback,
}: {
  activeSection: SectionId;
  role: UserRole;
  onOpenFeedback: () => void;
}) {
  return (
    <header className="flex flex-col gap-4 border-b border-slate-200 pb-6 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500">Employee-owned profile and analytics workspace</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
          {sectionTitle(activeSection)}
        </h1>
      </div>
      <div className="flex items-center gap-3">
        <Badge tone="blue">{role}</Badge>
        <button
          type="button"
          onClick={onOpenFeedback}
          className="inline-flex items-center gap-2 rounded-lg bg-slate-950 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800"
        >
          <FileUp size={16} />
          Import JSON
        </button>
      </div>
    </header>
  );
}
