import { cn } from "@/lib/utils";

export function InsightList({ title, items, tone }: { title: string; items: string[]; tone: "green" | "blue" }) {
  return (
    <div className="rounded-lg border border-slate-200 p-4">
      <p className="text-sm font-semibold">{title}</p>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li key={item} className="flex gap-2 text-sm leading-6 text-slate-600">
            <span className={cn("mt-2 size-1.5 rounded-full", tone === "green" ? "bg-emerald-500" : "bg-sky-500")} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
