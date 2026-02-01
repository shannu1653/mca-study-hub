import "./Sidebar.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FiHome,
  FiBook,
  FiUpload,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  /* ================= ADMIN CHECK ================= */
  const isAdmin =
    localStorage.getItem("is_admin") === "true" ||
    localStorage.getItem("is_admin") === "True";

  /* ================= ACTIVE LINK ================= */
  const isActive = (path) =>
    location.pathname === path ||
    location.pathname.startsWith(path + "/");

  /* ================= LOGOUT ================= */
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      {/* ================= LOGO ================= */}
      <div className="sidebar-header">
        <h2 className="logo">MCA Study</h2>
        <p className="subtitle">Study Hub</p>
      </div>

      {/* ================= NAV ================= */}
      <nav className="sidebar-nav">
        {/* 👤 USER DASHBOARD */}
        {!isAdmin && (
          <Link
            to="/dashboard"
            className={`nav-item ${isActive("/dashboard") ? "active" : ""}`}
          >
            <FiHome size={18} />
            <span>Dashboard</span>
          </Link>
        )}

        {/* 🏠 HOME (OPTIONAL BUT NICE) */}
        {!isAdmin && (
          <Link
            to="/home"
            className={`nav-item ${isActive("/home") ? "active" : ""}`}
          >
            <FiHome size={18} />
            <span>Home</span>
          </Link>
        )}

        {/* 📘 NOTES (ALL USERS) */}
        <Link
          to="/notes"
          className={`nav-item ${isActive("/notes") ? "active" : ""}`}
        >
          <FiBook size={18} />
          <span>Notes</span>
        </Link>

        {/* 🛠 ADMIN SECTION */}
        {isAdmin && (
          <>
            <div className="nav-section">ADMIN</div>

            <Link
              to="/admin"
              className={`nav-item ${isActive("/admin") ? "active" : ""}`}
            >
              <FiSettings size={18} />
              <span>Dashboard</span>
            </Link>

            <Link
              to="/admin/upload"
              className={`nav-item ${isActive("/admin/upload") ? "active" : ""}`}
            >
              <FiUpload size={18} />
              <span>Upload Notes</span>
            </Link>
          </>
        )}
      </nav>

      {/* ================= FOOTER ================= */}
      <div className="sidebar-footer">
        <button className="logout-btn" onClick={handleLogout}>
          <FiLogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
