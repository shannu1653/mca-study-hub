import "./Header.css";
import { FiSearch } from "react-icons/fi";
import { removeToken } from "../utils/auth";

function Header({ search, setSearch }) {
  const logout = () => {
    removeToken();
    localStorage.removeItem("is_admin");
    window.location.href = "/";
  };

  return (
    <header className="header">
      <div className="search-box">
        <FiSearch size={16} />
        <input
          type="text"
          placeholder="Search notes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <button onClick={logout}>Logout</button>
    </header>
  );
}

export default Header;
