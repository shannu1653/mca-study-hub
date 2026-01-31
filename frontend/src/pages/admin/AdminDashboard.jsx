import Layout from "../../layout/Layout"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import {
  Upload,
  Calendar,
  Layers,
  BookOpen,
  FileText
} from "lucide-react"

import "../../styles/adminDashboard.css"

function AdminDashboard() {
  const navigate = useNavigate()

  return (
    <Layout>
      <div className="admin-dashboard">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="admin-header"
        >
          <h2>Admin Panel</h2>
          <p>Manage MCA Study Point</p>
        </motion.div>

        {/* Cards */}
        <div className="admin-grid">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="admin-card"
          >
            <Link to="/admin/upload">
              <Upload size={28} />
              <span>Upload Notes</span>
            </Link>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="admin-card"
          >
            <Link to="/admin/years">
              <Calendar size={28} />
              <span>Manage Years</span>
            </Link>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="admin-card"
          >
            <Link to="/admin/semesters">
              <Layers size={28} />
              <span>Manage Semesters</span>
            </Link>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="admin-card"
          >
            <Link to="/admin/subjects">
              <BookOpen size={28} />
              <span>Manage Subjects</span>
            </Link>
          </motion.div>

          {/* Manage Notes Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="admin-btn primary"
            onClick={() => navigate("/admin/notes")}
          >
            <FileText size={22} />
            Manage Notes
          </motion.button>
        </div>
      </div>
    </Layout>
  )
}

export default AdminDashboard
