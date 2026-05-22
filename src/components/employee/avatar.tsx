import { cn } from "@/lib/utils";
import type { Employee } from "@/types/jtg-one";

export function Avatar({ employee, size = "md" }: { employee: Employee; size?: "md" | "lg" }) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-lg bg-slate-950 font-semibold text-white",
        size === "lg" ? "size-14 text-base" : "size-10 text-sm",
      )}
    >
      {employee.avatarInitials}
    </div>
  );
}
