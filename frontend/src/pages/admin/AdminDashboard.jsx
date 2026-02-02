import { Link, useNavigate } from "react-router-dom";
import {
  Upload,
  Calendar,
  Layers,
  BookOpen,
  FileText,
} from "lucide-react";

import "../../styles/adminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="admin-dashboard">
      {/* ================= HEADER ================= */}
      <div className="admin-header">
        <h2>Admin Dashboard</h2>
        <p>Manage MCA Study Hub content</p>
      </div>

      {/* ================= GRID ================= */}
      <div className="admin-grid">
        <Link to="/admin/upload" className="admin-card">
          <Upload size={30} />
          <span>Upload Notes</span>
        </Link>

        <Link to="/admin/years" className="admin-card">
          <Calendar size={30} />
          <span>Manage Years</span>
        </Link>

        <Link to="/admin/semesters" className="admin-card">
          <Layers size={30} />
          <span>Manage Semesters</span>
        </Link>

        <Link to="/admin/subjects" className="admin-card">
          <BookOpen size={30} />
          <span>Manage Subjects</span>
        </Link>

        <button
          className="admin-card primary"
          onClick={() => navigate("/admin/notes")}
        >
          <FileText size={26} />
          <span>Manage Notes</span>
        </button>
      </div>
    </div>
  );
}

export default AdminDashboard;
