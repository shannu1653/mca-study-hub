import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../styles/layout.css";

function Layout({ children, search, setSearch }) {
  const navigate = useNavigate();
  const location = useLocation();

  /* ✅ ROLE CHECK (SAFE) */
  const isAdmin =
    localStorage.getItem("is_admin") === "true" ||
    localStorage.getItem("is_admin") === "True";

  /* 🌙 DARK MODE */
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  /* ⭐ SAVED COUNT */
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

  /* LOGOUT */
  const logout = () => {
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  /* ACTIVE LINK */
  const isActive = (path) =>
  location.pathname === path ||
  location.pathname.startsWith(path + "/");


  return (
    <div className="layout">
      {/* ================= SIDEBAR ================= */}
      <aside className="sidebar desktop-only">
        <h2>MCA Study</h2>

        <nav>
          {/* 👤 USER DASHBOARD */}
         {!isAdmin && (
  <Link
    to="/dashboard"
    className={`nav-link ${isActive("/dashboard") ? "active" : ""}`}
  >
    📊 Dashboard
  </Link>
)}


          {/* 📘 NOTES */}
          <Link
            to="/notes"
            className={isActive("/notes") ? "active" : ""}
          >
            📘 Notes
          </Link>

          {/* 🛠 ADMIN */}
          {isAdmin && (
            <>
              <Link
                to="/admin"
                className={isActive("/admin") ? "active" : ""}
              >
                🛠 Admin Dashboard
              </Link>

              <Link
                to="/admin/upload"
                className={isActive("/admin/upload") ? "active" : ""}
              >
                ⬆ Upload Notes
              </Link>
            </>
          )}
        </nav>
      </aside>

      {/* ================= MAIN ================= */}
      <main className="main">
        <header className="topbar">
          {!isAdmin && location.pathname === "/notes" && (
  <Link to="/dashboard" className="dashboard-quick-btn">
    📊 Go to Dashboard
  </Link>
)}

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

      {/* ================= 📱 MOBILE NAV ================= */}
      <nav className="bottom-nav mobile-only">
        {!isAdmin && (
          <Link
            to="/dashboard"
            className={isActive("/dashboard") ? "active" : ""}
          >
            📊
            <span>Dashboard</span>
          </Link>
        )}

        <Link
          to="/notes"
          className={isActive("/notes") ? "active" : ""}
        >
          📘
          <span>Notes</span>
        </Link>

        {isAdmin && (
          <Link
            to="/admin"
            className={isActive("/admin") ? "active" : ""}
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
 