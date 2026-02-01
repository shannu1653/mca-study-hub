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

export default function Home() {
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
  const newNotes = notes.filter((n) => isNewNote(n.created_at));
  const savedCount =
    JSON.parse(localStorage.getItem("bookmarks"))?.length || 0;

  return (
    <div className="home-page">
      {/* ================= TOP NAV ================= */}
      <header className="home-nav">
        <div className="brand">
          🎓 <span>MCA Study Hub</span>
        </div>
        <div className="nav-actions">
          <Link to="/notes" className="nav-btn">
            📘 Notes
          </Link>
          <Link to="/dashboard" className="nav-btn outline">
            📊 Dashboard
          </Link>
        </div>
      </header>

      {/* ================= HERO ================= */}
      <section className="home-hero">
        <h1>
          Welcome back, <span>{username}</span> 👋
        </h1>
        <p>
          All your MCA study materials, organized and accessible anytime.
        </p>

        <div className="hero-actions">
          <Link to="/notes" className="btn primary">
            📚 Browse Notes
          </Link>
          <Link to="/notes?saved=true" className="btn ghost">
            ⭐ Saved Notes
          </Link>
        </div>
      </section>

      {/* ================= STATS ================= */}
      <section className="home-stats">
        <div className="stat-card">
          <h3>{loading ? "—" : totalNotes}</h3>
          <p>Total Notes</p>
        </div>

        <div className="stat-card">
          <h3>{loading ? "—" : totalDownloads}</h3>
          <p>Total Downloads</p>
        </div>

        <div className="stat-card highlight">
          <h3>{loading ? "—" : newNotes.length}</h3>
          <p>New This Week</p>
        </div>

        <div className="stat-card">
          <h3>{savedCount}</h3>
          <p>Saved Notes</p>
        </div>
      </section>

      {/* ================= QUICK ACTIONS ================= */}
      <section className="quick-section">
        <h2>⚡ Quick Actions</h2>

        <div className="quick-grid">
          <Link to="/notes" className="quick-card">
            📄 View All Notes
            <span>Browse by year & subject</span>
          </Link>

          <Link to="/notes" className="quick-card">
            🔥 Trending Notes
            <span>Most downloaded</span>
          </Link>

          <Link to="/notes" className="quick-card">
            🆕 Latest Uploads
            <span>Recently added PDFs</span>
          </Link>
        </div>
      </section>

      {/* ================= NEW NOTES ================= */}
      {!loading && newNotes.length > 0 && (
        <section className="recent-section">
          <h2>🆕 New Notes</h2>

          <div className="recent-grid">
            {newNotes.slice(0, 3).map((note) => (
              <div key={note.id} className="recent-card">
                <h4>{note.title}</h4>
                <p>
                  {note.subject?.name} •{" "}
                  {note.subject?.semester?.name}
                </p>
                <Link to="/notes">View</Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ================= FOOTER ================= */}
      <footer className="home-footer">
        <p>© {new Date().getFullYear()} MCA Study Hub</p>
        <p>Built for students. Designed for focus.</p>
      </footer>
    </div>
  );
}
