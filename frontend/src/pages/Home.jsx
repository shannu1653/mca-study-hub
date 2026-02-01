import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import "../styles/home.css";

/* ================= HELPER ================= */
const isNewNote = (createdAt) => {
  const noteDate = new Date(createdAt);
  const now = new Date();
  return (now - noteDate) / (1000 * 60 * 60 * 24) <= 7;
};

function Home() {
  const username = localStorage.getItem("username") || "Student";

  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH NOTES ================= */
  useEffect(() => {
    api
      .get("notes/")
      .then((res) => setNotes(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  /* ================= STATS ================= */
  const totalNotes = notes.length;

  const totalDownloads = notes.reduce(
    (sum, n) => sum + (n.download_count || 0),
    0
  );

  const newNotesCount = notes.filter((n) =>
    isNewNote(n.created_at)
  ).length;

  const savedNotesCount =
    JSON.parse(localStorage.getItem("bookmarks"))?.length || 0;

  return (
    <div className="home-page">
      {/* ================= HERO ================= */}
      <div className="home-hero">
        <h1>Welcome, {username} 👋</h1>
        <p>Your MCA study dashboard. Learn smart. Download fast.</p>

        <div className="hero-actions">
          <Link to="/notes" className="btn primary">
            📚 Browse Notes
          </Link>
          <Link to="/notes" className="btn outline">
            ⭐ Saved Notes
          </Link>
        </div>
      </div>

      {/* ================= STATS ================= */}
      <div className="home-stats">
        <div className="stat-card">
          <span>📘</span>
          <div>
            <h3>{loading ? "—" : totalNotes}</h3>
            <p>Total Notes</p>
          </div>
        </div>

        <div className="stat-card">
          <span>⬇</span>
          <div>
            <h3>{loading ? "—" : totalDownloads}</h3>
            <p>Total Downloads</p>
          </div>
        </div>

        <div className="stat-card">
          <span>🆕</span>
          <div>
            <h3>{loading ? "—" : newNotesCount}</h3>
            <p>New This Week</p>
          </div>
        </div>

        <div className="stat-card">
          <span>⭐</span>
          <div>
            <h3>{savedNotesCount}</h3>
            <p>Saved Notes</p>
          </div>
        </div>
      </div>

      {/* ================= QUICK LINKS ================= */}
      <div className="quick-links">
        <h2>Quick Actions</h2>

        <div className="quick-grid">
          <Link to="/notes" className="quick-card">
            📄 View Notes
          </Link>

          <Link to="/notes" className="quick-card">
            🔥 Trending
          </Link>

          <Link to="/notes" className="quick-card">
            🆕 New Uploads
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
