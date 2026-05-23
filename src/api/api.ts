const API_BASE = "/api";

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    throw new Error(`API ${path} failed (${res.status})`);
  }
  return res.json() as Promise<T>;
}

// ── Employee ─────────────────────────────────────────────────────────
export function fetchEmployees() {
  return apiFetch<any[]>("/employees");
}

// ── Profile / Dashboard ──────────────────────────────────────────────
export function fetchDashboardData(employeeId: string) {
  return apiFetch<any>(`/profile/${employeeId}/dashboard`);
}

export function fetchProfile(employeeId: string) {
  return apiFetch<any>(`/profile/${employeeId}`);
}

// ── Search ───────────────────────────────────────────────────────────
export function searchPeople(q: string) {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  return apiFetch<any[]>(`/search/people?${params.toString()}`);
}

// ── Timeline ─────────────────────────────────────────────────────────
export function fetchTimeline(employeeId: string) {
  return apiFetch<any[]>(`/timeline/${employeeId}`);
}

// ── Feedback ─────────────────────────────────────────────────────────
export function fetchFeedbackHistory(employeeId: string) {
  return apiFetch<any[]>(`/feedback/history/${employeeId}`);
}

export function fetchLatestFeedback(employeeId: string) {
  return apiFetch<any>(`/feedback/latest/${employeeId}`);
}

// ── AI Suggestions (goals) ───────────────────────────────────────────
export function fetchGoals(employeeId: string) {
  return apiFetch<any>(`/ai/suggestions/${employeeId}`);
}

// ── Visibility ───────────────────────────────────────────────────────
export function fetchVisibility(employeeId: string) {
  return apiFetch<any>(`/visibility/${employeeId}`);
}

export function updateVisibility(employeeId: string, settings: Record<string, string>) {
  return apiFetch<any>(`/visibility/${employeeId}`, {
    method: "PUT",
    body: JSON.stringify(settings),
  });
}
