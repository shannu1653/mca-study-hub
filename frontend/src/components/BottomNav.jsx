// src/components/BottomNav.jsx
import { NavLink } from "react-router-dom";
import "./BottomNav.css";

export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      <NavLink to="/dashboard" className="nav-item">
        📊
        <span>Dashboard</span>
      </NavLink>

      <NavLink to="/notes" className="nav-item">
        📚
        <span>Notes</span>
      </NavLink>

      <NavLink to="/bookmarks" className="nav-item">
        🔖
        <span>Saved</span>
      </NavLink>

      <NavLink to="/profile" className="nav-item">
        👤
        <span>Profile</span>
      </NavLink>
    </nav>
  );
}
