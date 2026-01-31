import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../styles/layout.css";

function Layout({ children, search, setSearch }) {
  const navigate = useNavigate();
  const location = useLocation();

  const isAdmin = localStorage.getItem("is_admin") === "true";

  /* 🌙 Dark Mode */
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  /* ⭐ Saved Count */
  const [savedCount, setSavedCount] = useState(0);

  /* APPLY THEME */
  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      darkMode ? "dark" : "light"
    );
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  /* LOAD SAVED */
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("bookmarks")) || [];
    setSavedCount(saved.length);
  }, []);

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("is_admin");
    navigate("/login", { replace: true });
  };

  return (
    <div className="layout">
      {/* ===== SIDEBAR (DESKTOP ONLY) ===== */}
      <aside className="sidebar desktop-only">
        <h2>MCA Study</h2>

        <nav>
          <Link to="/dashboard">📊 Dashboard</Link>
          <Link to="/notes">📘 Notes</Link>

          {isAdmin && (
            <>
              <Link to="/admin">🛠 Admin</Link>
              <Link to="/admin/upload">⬆ Upload</Link>
            </>
          )}
        </nav>
      </aside>

      {/* ===== MAIN ===== */}
      <main className="main">
        <header className="topbar">
          {setSearch && (
            <input
              placeholder="Search notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          )}

          <div className="top-actions">
            <div className="saved-pill">
              ⭐ Saved <span>{savedCount}</span>
            </div>

            <button onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? "☀ Light" : "🌙 Dark"}
            </button>

            <button onClick={logout} className="logout-btn">
              Logout
            </button>
          </div>
        </header>

        <div className="content">{children}</div>
      </main>

      {/* ===== 📱 MOBILE BOTTOM NAV ===== */}
      <nav className="bottom-nav mobile-only">
        <Link
          to="/dashboard"
          className={location.pathname === "/dashboard" ? "active" : ""}
        >
          📊
          <span>Dashboard</span>
        </Link>

        <Link
          to="/notes"
          className={location.pathname === "/notes" ? "active" : ""}
        >
          📘
          <span>Notes</span>
        </Link>

        {isAdmin && (
          <Link
            to="/admin"
            className={location.pathname === "/admin" ? "active" : ""}
          >
            🛠
            <span>Admin</span>
          </Link>
        )}

        <button onClick={logout}>
          🚪
          <span>Logout</span>
        </button>
      </nav>
    </div>
  );
}

export default Layout;
