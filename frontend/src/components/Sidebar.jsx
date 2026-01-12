import "./Sidebar.css";
import { Link } from "react-router-dom";
import { FiBook, FiUpload } from "react-icons/fi";

function Sidebar() {
  const isAdmin = localStorage.getItem("is_admin") === "true";

  return (
    <aside className="sidebar">
      <h2 className="logo">MCA Study</h2>

      <nav>
        {/* Notes – visible to all */}
        <Link to="/notes">
          <FiBook size={18} style={{ marginRight: "8px" }} />
          Notes
        </Link>
        

         {isAdmin && (
        <Link to="/admin">🛠 Admin</Link>
      )}

        {/* Upload – admin only */}
        {isAdmin && (
          <Link to="/admin/upload">
            <FiUpload size={18} style={{ marginRight: "8px" }} />
            Upload
          </Link>
        )}
      </nav>
    </aside>
  );
}

export default Sidebar;
