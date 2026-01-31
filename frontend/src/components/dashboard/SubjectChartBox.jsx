// src/components/dashboard/SubjectChartBox.jsx
import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import EmptyState from "../ui/EmptyState";

export default function SubjectChartBox({ data = [] }) {
  const isDark =
    document.documentElement.getAttribute("data-theme") === "dark";

  /* ✅ EMPTY STATE */
  if (!data || data.length === 0) {
    return (
      <div className="chart-card">
        <h4 className="chart-title">Subject-wise Notes</h4>
        <EmptyState
          title="No Subjects Found"
          message="Your subject-wise statistics will appear here."
        />
      </div>
    );
  }

  return (
    <div className="chart-card">
      <h4 className="chart-title">Subject-wise Notes</h4>

      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={50}
            outerRadius={80}
            paddingAngle={4}
            fill={isDark ? "#38bdf8" : "#2563eb"}
            animationDuration={700}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: isDark ? "#020617" : "#ffffff",
              border: "none",
              borderRadius: "8px",
              color: isDark ? "#e5e7eb" : "#0f172a",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
