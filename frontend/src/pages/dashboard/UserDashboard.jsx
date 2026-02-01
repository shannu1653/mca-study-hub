import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/dashboard.css";

import StatCard from "../../components/StatCard";
import { getUserDashboardStats } from "../../api/dashboardApi";
import ErrorState from "../../components/ui/ErrorState";
import EmptyState from "../../components/ui/EmptyState";

export default function UserDashboard() {
  const navigate = useNavigate();

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

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="user-dashboard">
        <EmptyState
          title="Loading Dashboard"
          message="Preparing your study overview..."
        />
      </div>
    );
  }

  /* ================= ERROR ================= */
  if (error) {
    return (
      <div className="user-dashboard">
        <ErrorState
          message="Failed to load dashboard data."
          retry={() => window.location.reload()}
        />
      </div>
    );
  }

  /* ================= EMPTY ================= */
  if (!stats) {
    return (
      <div className="user-dashboard">
        <EmptyState
          title="No Data Yet"
          message="Start browsing notes to see insights here."
        />
      </div>
    );
  }

  return (
    <div className="user-dashboard">
      {/* ================= HEADER ================= */}
      <div className="dashboard-header">
        <h2>📊 Dashboard</h2>
        <p>Your MCA study progress at a glance</p>
      </div>

      {/* ================= STATS ================= */}
      <div className="stats-grid">
        <StatCard title="Total Notes" value={stats.total_notes || 0} />
        <StatCard title="Saved Notes" value={stats.bookmarks || 0} />
        <StatCard title="Subjects" value={stats.subjects || 0} />
        <StatCard title="Semesters" value={stats.semesters || 0} />
      </div>

      {/* ================= QUICK ACTIONS ================= */}
      <div className="dashboard-section">
        <h3>⚡ Quick Actions</h3>

        <div className="quick-actions">
          <button onClick={() => navigate("/notes")}>
            📘 Browse Notes
          </button>

          <button onClick={() => navigate("/notes?saved=true")}>
            ⭐ Saved Notes
          </button>
        </div>
      </div>

      {/* ================= PROGRESS ================= */}
      <div className="dashboard-section">
        <h3>📈 Study Progress</h3>

        <div className="progress-cards">
          <div className="progress-card">
            <span>Notes Explored</span>
            <strong>{stats.total_notes || 0}</strong>
          </div>

          <div className="progress-card">
            <span>Notes Saved</span>
            <strong>{stats.bookmarks || 0}</strong>
          </div>
        </div>
      </div>

      {/* ================= CTA ================= */}
      <div className="dashboard-cta">
        <h3>🚀 Keep Learning</h3>
        <p>New notes are added regularly. Don’t miss out.</p>
        <button onClick={() => navigate("/notes")}>
          Explore Notes
        </button>
      </div>
    </div>
  );
}
