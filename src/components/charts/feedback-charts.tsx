"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { FeedbackAnalysis } from "@/types/jtg-one";

const tooltipStyle = {
  border: "1px solid #e2e8f0",
  borderRadius: 8,
  boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
};

export function CategoryBarChart({ analysis }: { analysis: FeedbackAnalysis }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={analysis.categories} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
        <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} domain={[0, 100]} />
        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "#f8fafc" }} />
        <Bar dataKey="score" name="Current" fill="#0f172a" radius={[6, 6, 0, 0]} />
        <Bar dataKey="benchmark" name="Benchmark" fill="#38bdf8" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function FeedbackTrendChart({ analysis }: { analysis: FeedbackAnalysis }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={analysis.trends} margin={{ top: 8, right: 18, left: -24, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
        <XAxis dataKey="cycle" tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} domain={[50, 100]} />
        <Tooltip contentStyle={tooltipStyle} />
        <Line type="monotone" dataKey="technical" stroke="#0f172a" strokeWidth={2.5} dot={false} />
        <Line type="monotone" dataKey="ownership" stroke="#10b981" strokeWidth={2.5} dot={false} />
        <Line type="monotone" dataKey="communication" stroke="#f59e0b" strokeWidth={2.5} dot={false} />
        <Line type="monotone" dataKey="collaboration" stroke="#0284c7" strokeWidth={2.5} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function FeedbackRadarChart({ analysis }: { analysis: FeedbackAnalysis }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <RadarChart data={analysis.categories}>
        <PolarGrid stroke="#e2e8f0" />
        <PolarAngleAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 12 }} />
        <Radar dataKey="score" fill="#0f172a" fillOpacity={0.18} stroke="#0f172a" strokeWidth={2} />
      </RadarChart>
    </ResponsiveContainer>
  );
}
