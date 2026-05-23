"use client";

import { useQuery } from "@tanstack/react-query";
import {
  fetchEmployees,
  fetchDashboardData,
  fetchProfile,
  searchPeople,
} from "@/api/api";

export function useEmployees() {
  return useQuery({
    queryKey: ["employees"],
    queryFn: fetchEmployees,
    staleTime: 60_000,
  });
}

export function useDashboardData(employeeId: string | undefined) {
  return useQuery({
    queryKey: ["dashboard", employeeId],
    queryFn: () => fetchDashboardData(employeeId!),
    enabled: !!employeeId,
    staleTime: 30_000,
  });
}

export function useProfileData(employeeId: string | undefined) {
  return useQuery({
    queryKey: ["profile", employeeId],
    queryFn: () => fetchProfile(employeeId!),
    enabled: !!employeeId,
    staleTime: 30_000,
  });
}

export function useSearchPeople(query: string) {
  return useQuery({
    queryKey: ["search", query],
    queryFn: () => searchPeople(query),
    staleTime: 10_000,
  });
}
