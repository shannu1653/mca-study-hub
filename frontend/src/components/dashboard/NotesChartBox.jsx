// src/components/dashboard/NotesChartBox.jsx
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import EmptyState from "../ui/EmptyState";

export default function NotesChartBox({ data = [] }) {
  const isDark =
    document.documentElement.getAttribute("data-theme") === "dark";

  /* ✅ EMPTY STATE */
  if (!data || data.length === 0) {
    return (
      <div className="chart-card">
        <h4 className="chart-title">Notes per Semester</h4>
        <EmptyState
          title="No Notes Found"
          message="Upload notes to see semester-wise statistics."
        />
      </div>
    );
  }

  return (
    <div className="chart-card">
      <h4 className="chart-title">Notes per Semester</h4>

      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data}>
          <XAxis
            dataKey="semester"
            stroke={isDark ? "#94a3b8" : "#334155"}
          />
          <YAxis stroke={isDark ? "#94a3b8" : "#334155"} />

          <Tooltip
            contentStyle={{
              backgroundColor: isDark ? "#020617" : "#ffffff",
              border: "none",
              borderRadius: "8px",
              color: isDark ? "#e5e7eb" : "#0f172a",
            }}
          />

          <Bar
            dataKey="notes"
            fill={isDark ? "#38bdf8" : "#2563eb"}
            radius={[6, 6, 0, 0]}
            animationDuration={600}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
