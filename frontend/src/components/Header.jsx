import "./Header.css";
import { FiSearch, FiHome } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { removeToken } from "../utils/auth";

function Header({ search, setSearch }) {
  const navigate = useNavigate();

  const isAdmin =
    localStorage.getItem("is_admin") === "true" ||
    localStorage.getItem("is_admin") === "True";

  const logout = () => {
    removeToken();
    localStorage.removeItem("is_admin");
    window.location.href = "/";
  };

  const goDashboard = () => {
    navigate(isAdmin ? "/admin" : "/dashboard");
  };

  return (
    <header className="header">
      {/* 🔹 LEFT: DASHBOARD (MOBILE ONLY) */}
      <button className="mobile-dashboard-btn" onClick={goDashboard}>
        <FiHome size={18} />
        <span>Dashboard</span>
      </button>

      {/* 🔍 SEARCH */}
      <div className="search-box">
        <FiSearch size={16} />
        <input
          type="text"
          placeholder="Search notes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* 🚪 LOGOUT */}
      <button className="logout-btn" onClick={logout}>
        Logout
      </button>
    </header>
  );
}

export default Header;
