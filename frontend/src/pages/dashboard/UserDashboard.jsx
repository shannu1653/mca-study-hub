// src/pages/dashboard/UserDashboard.jsx
import { useEffect, useState } from "react";
import "../../styles/dashboard.css";
import StatCard from "../../components/dashboard/StatCard";
import NotesChartBox from "../../components/dashboard/NotesChartBox";
import SubjectChartBox from "../../components/dashboard/SubjectChartBox";
import { getUserDashboardStats } from "../../api/dashboardApi";
import ErrorState from "../../components/ui/ErrorState";
import EmptyState from "../../components/ui/EmptyState";

export default function UserDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    getUserDashboardStats()
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  /* 🔄 LOADING STATE */
  if (loading) {
    return (
      <div className="user-dashboard">
        <EmptyState
          title="Loading Dashboard"
          message="Fetching your latest study statistics..."
        />
      </div>
    );
  }

  /* ❌ ERROR STATE */
  if (error) {
    return (
      <div className="user-dashboard">
        <ErrorState
          message="Unable to load dashboard data."
          retry={() => window.location.reload()}
        />
      </div>
    );
  }

  /* 📭 NO DATA STATE */
  if (!stats) {
    return (
      <div className="user-dashboard">
        <EmptyState
          title="No Dashboard Data"
          message="Start using the app to see insights here."
        />
      </div>
    );
  }

  return (
    <div className="user-dashboard">
      <h2 className="dashboard-title">Overview</h2>


      {/* ===== STATS ===== */}
      <div className="stats-grid">
        <StatCard title="Total Notes" value={stats.total_notes || 0} />
        <StatCard title="Bookmarks" value={stats.bookmarks || 0} />
        <StatCard title="Subjects" value={stats.subjects || 0} />
        <StatCard title="Semesters" value={stats.semesters || 0} />
      </div>

      {/* ===== CHARTS ===== */}
      <div className="charts-grid">
        <NotesChartBox data={stats.notes_per_semester || []} />
        <SubjectChartBox data={stats.notes_per_subject || []} />
      </div>
    </div>
  );
}
