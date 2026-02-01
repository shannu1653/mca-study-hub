import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import "../styles/layout.css";

function Layout() {
  const navigate = useNavigate();
  const location = useLocation();

  const isAdmin = localStorage.getItem("is_admin") === "true";

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  const [savedCount, setSavedCount] = useState(0);

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      darkMode ? "dark" : "light"
    );
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("bookmarks")) || [];
    setSavedCount(saved.length);
  }, [location.pathname]);

  const logout = () => {
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  const isActive = (path) =>
    location.pathname === path ||
    location.pathname.startsWith(path + "/");

  /* 📄 PAGE TITLE (MOBILE) */
  const getTitle = () => {
    if (location.pathname.startsWith("/dashboard")) return "Dashboard";
    if (location.pathname.startsWith("/notes")) return "Notes";
    if (location.pathname.startsWith("/home")) return "Home";
    return "MCA Study Hub";
  };

  return (
    <div className="layout">
      {/* ================= SIDEBAR (DESKTOP) ================= */}
      <aside className="sidebar desktop-only">
        <h2 className="logo">MCA Study</h2>

        <nav>
          <Link to="/home" className={isActive("/home") ? "active" : ""}>
            🏠 Home
          </Link>

          {!isAdmin && (
            <Link
              to="/dashboard"
              className={isActive("/dashboard") ? "active" : ""}
            >
              📊 Dashboard
            </Link>
          )}

          <Link to="/notes" className={isActive("/notes") ? "active" : ""}>
            📘 Notes
          </Link>

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
        {/* 🔝 DESKTOP TOPBAR */}
        <header className="topbar desktop-only">
          <Link to="/home" className="dashboard-quick-btn">
            🏠 Home
          </Link>

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

        {/* 📱 MOBILE HEADER */}
        <header className="mobile-header mobile-only">
          <span className="app-name">🎓 MCA</span>
          <span className="page-title">{getTitle()}</span>

          <div className="mobile-actions">
            <button onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? "☀" : "🌙"}
            </button>
            <button onClick={logout}>🚪</button>
          </div>
        </header>

        <div className="content">
          <Outlet />
        </div>
      </main>

      {/* ================= MOBILE BOTTOM NAV ================= */}
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

        <Link to="/notes" className={isActive("/notes") ? "active" : ""}>
          📘
          <span>Notes</span>
        </Link>

        <Link to="/home" className={isActive("/home") ? "active" : ""}>
          🏠
          <span>Home</span>
        </Link>
      </nav>
    </div>
  );
}

export default Layout;
