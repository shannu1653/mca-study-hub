import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";

import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";
import Layout from "./layout/Layout";

/* USER */
import Home from "./pages/Home";
import Notes from "./pages/Notes";
import UserDashboard from "./pages/dashboard/UserDashboard";

/* ADMIN */
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUpload from "./pages/admin/AdminUpload";
import ManageYears from "./pages/admin/ManageYears";
import ManageSemesters from "./pages/admin/ManageSemesters";
import ManageSubjects from "./pages/admin/ManageSubjects";
import ManageNotes from "./pages/admin/ManageNotes";

function App() {
  const token = localStorage.getItem("access");
  const isAdmin = localStorage.getItem("is_admin") === "true";

  return (
    <Routes>
      {/* ================= PUBLIC ================= */}
      <Route
        path="/"
        element={token ? <Navigate to="/home" replace /> : <Login />}
      />

      <Route
        path="/login"
        element={token ? <Navigate to="/home" replace /> : <Login />}
      />

      <Route
        path="/register"
        element={token ? <Navigate to="/home" replace /> : <Register />}
      />

      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* ================= USER ================= */}
      <Route
        element={
          <ProtectedRoute>
            {!isAdmin ? <Layout /> : <Navigate to="/admin" replace />}
          </ProtectedRoute>
        }
      >
        <Route path="/home" element={<Home />} />
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/notes" element={<Notes />} />
      </Route>

      {/* ================= ADMIN ================= */}
      <Route
        element={
          <AdminRoute>
            <Layout />
          </AdminRoute>
        }
      >
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/upload" element={<AdminUpload />} />
        <Route path="/admin/years" element={<ManageYears />} />
        <Route path="/admin/semesters" element={<ManageSemesters />} />
        <Route path="/admin/subjects" element={<ManageSubjects />} />
        <Route path="/admin/notes" element={<ManageNotes />} />
      </Route>

      {/* ================= FALLBACK ================= */}
      <Route
        path="*"
        element={
          token ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />
        }
      />
    </Routes>
  );
}

export default App;
