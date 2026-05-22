import { BarChart3, Goal, LayoutDashboard, Search, ShieldCheck, UserRound } from "lucide-react";

export const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "profile", label: "My Profile", icon: UserRound },
  { id: "feedback", label: "Feedback", icon: BarChart3 },
  { id: "goals", label: "Growth Goals", icon: Goal },
  { id: "people", label: "People Search", icon: Search },
  { id: "visibility", label: "Visibility", icon: ShieldCheck },
] as const;

export type SectionId = (typeof navItems)[number]["id"];

export function sectionTitle(section: SectionId) {
  const titles: Record<SectionId, string> = {
    dashboard: "My dashboard",
    profile: "My profile",
    feedback: "Feedback analytics",
    goals: "Growth goals",
    people: "People search",
    visibility: "Visibility settings",
  };

  return titles[section];
}
