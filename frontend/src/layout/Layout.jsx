import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import "../styles/layout.css";
import { FiHome } from "react-icons/fi";


function Layout() {
  const navigate = useNavigate();
  const location = useLocation();

  /* ✅ ROLE CHECK */
  const isAdmin = localStorage.getItem("is_admin") === "true";

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

  /* LOAD SAVED COUNT */
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("bookmarks")) || [];
    setSavedCount(saved.length);
  }, [location.pathname]);

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
        <h2 className="logo">MCA Study</h2>

        <nav>
  {/* 🏠 HOME */}
  <Link
    to="/home"
    className={isActive("/home") ? "active" : ""}
  >
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

  <Link
    to="/notes"
    className={isActive("/notes") ? "active" : ""}
  >
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
        <header className="topbar">
          {!isAdmin && location.pathname.startsWith("/notes") && (
            <Link to="/dashboard" className="dashboard-quick-btn">
              📊 Go to Dashboard
            </Link>
            
          )}
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

        {/* ✅ THIS IS THE MOST IMPORTANT LINE */}
        <div className="content">
          <Outlet />
        </div>
      </main>

      {/* ================= MOBILE NAV ================= */}
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
