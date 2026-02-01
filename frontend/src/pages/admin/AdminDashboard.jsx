import Layout from "../../layout/Layout";
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
    <Layout>
      <div className="admin-dashboard">
        {/* Header */}
        <div className="admin-card admin-header">
          <h2>Admin Panel</h2>
          <p>Manage MCA Study Point</p>
        </div>

        {/* Cards */}
        <div className="admin-grid">
          <div className="admin-card">
            <Link to="/admin/upload">
              <Upload size={28} />
              <span>Upload Notes</span>
            </Link>
          </div>

          <div className="admin-card">
            <Link to="/admin/years">
              <Calendar size={28} />
              <span>Manage Years</span>
            </Link>
          </div>

          <div className="admin-card">
            <Link to="/admin/semesters">
              <Layers size={28} />
              <span>Manage Semesters</span>
            </Link>
          </div>

          <div className="admin-card">
            <Link to="/admin/subjects">
              <BookOpen size={28} />
              <span>Manage Subjects</span>
            </Link>
          </div>

          {/* Manage Notes Button */}
          <button
            className="admin-btn primary"
            onClick={() => navigate("/admin/notes")}
          >
            <FileText size={22} />
            <span>Manage Notes</span>
          </button>
        </div>
      </div>
    </Layout>
  );
}

export default AdminDashboard;
