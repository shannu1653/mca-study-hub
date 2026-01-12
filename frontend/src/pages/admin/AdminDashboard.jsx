import Layout from "../../layout/Layout";
import { Link } from "react-router-dom";
import "../../styles/adminDashboard.css";
import { useNavigate } from "react-router-dom";


function AdminDashboard() {
   const navigate = useNavigate();   // ✅ REQUIRED
  return (
    <Layout>
      <div className="admin-dashboard">
        <h2>Admin Panel</h2>
        <p>Manage MCA Study Point</p>

        <div className="admin-grid">
          <Link to="/admin/upload" className="admin-card">
            Upload Notes
          </Link>

          <Link to="/admin/years" className="admin-card">
            Manage Years
          </Link>

          <Link to="/admin/semesters" className="admin-card">
            Manage Semesters
          </Link>
           
          <Link to="/admin/subjects" className="admin-card">
            Manage Subjects
          </Link>
<button
  className="admin-btn primary"
  onClick={() => navigate("/admin/notes")}
>
  Manage Notes
</button>


        </div>
      </div>
    </Layout>
  );
}

export default AdminDashboard;
