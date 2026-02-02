// src/components/BottomNav.jsx
import { NavLink } from "react-router-dom";
import "./BottomNav.css";

export default function BottomNav() {
  const isAdmin =
    localStorage.getItem("is_admin") === "true" ||
    localStorage.getItem("is_admin") === "True";

  return (
    <nav className="bottom-nav">
      {/* DASHBOARD */}
      <NavLink
        to={isAdmin ? "/admin" : "/dashboard"}
        className="nav-item"
      >
        📊
        <span>Dashboard</span>
      </NavLink>

      {/* NOTES */}
      <NavLink to="/notes" className="nav-item">
        📚
        <span>Notes</span>
      </NavLink>

      {/* SAVED (OPTIONAL / FUTURE) */}
      <NavLink to="/bookmarks" className="nav-item">
        🔖
        <span>Saved</span>
      </NavLink>

      {/* PROFILE (OPTIONAL / FUTURE) */}
      <NavLink to="/profile" className="nav-item">
        👤
        <span>Profile</span>
      </NavLink>
    </nav>
  );
}
