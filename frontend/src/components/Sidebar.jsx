import "./Sidebar.css";
import { Link, useLocation } from "react-router-dom";
import { FiBook, FiUpload, FiHome, FiSettings } from "react-icons/fi";

function Sidebar() {
  const location = useLocation();

  /* ✅ SAFE ADMIN CHECK */
  const isAdmin =
    localStorage.getItem("is_admin") === "true" ||
    localStorage.getItem("is_admin") === "True";

  /* ✅ ACTIVE LINK */
  const isActive = (path) =>
    location.pathname === path ||
    location.pathname.startsWith(path + "/");

  return (
    <aside className="sidebar">
      <h2 className="logo">MCA Study</h2>

      <nav>
        {/* 👤 USER DASHBOARD */}
        {!isAdmin && (
          <Link to="/dashboard" className={isActive("/dashboard") ? "active" : ""}>
            <FiHome size={18} />
            <span>Dashboard</span>
          </Link>
        )}

        {/* 📘 NOTES (ALL USERS) */}
        <Link to="/notes" className={isActive("/notes") ? "active" : ""}>
          <FiBook size={18} />
          <span>Notes</span>
        </Link>

        {/* 🛠 ADMIN LINKS */}
        {isAdmin && (
          <>
            <Link to="/admin" className={isActive("/admin") ? "active" : ""}>
              <FiSettings size={18} />
              <span>Admin</span>
            </Link>

            <Link
              to="/admin/upload"
              className={isActive("/admin/upload") ? "active" : ""}
            >
              <FiUpload size={18} />
              <span>Upload</span>
            </Link>
          </>
        )}
      </nav>
    </aside>
  );
}

export default Sidebar;
