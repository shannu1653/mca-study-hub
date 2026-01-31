import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Notes from "./pages/Notes";

import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";

/* Admin pages */
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUpload from "./pages/admin/AdminUpload";
import ManageYears from "./pages/admin/ManageYears";
import ManageSemesters from "./pages/admin/ManageSemesters";
import ManageSubjects from "./pages/admin/ManageSubjects";
import ManageNotes from "./pages/admin/ManageNotes";
import ForgotPassword from "./pages/ForgotPassword";
import UserDashboard from "./pages/dashboard/UserDashboard";


function App() {
  const token = localStorage.getItem("access_token");
  const isAdmin = localStorage.getItem("is_admin") === "true";
  

  return (
    <Routes>
      {/* ================= PUBLIC ================= */}
      <Route
        path="/"
        element={
          token ? <Navigate to="/notes" replace /> : <Login />
        }
      />

      <Route
        path="/login"
        element={
          token ? <Navigate to="/notes" replace /> : <Login />
        }
      />

      <Route
        path="/register"
        element={
          token ? <Navigate to="/notes" replace /> : <Register />
        }
      />
      <Route path="/forgot-password" element={<ForgotPassword />} />


      {/* ================= USER ================= */}
      <Route
        path="/notes"
        element={
          <ProtectedRoute>
            <Notes />
          </ProtectedRoute>
        }
      />

      {/* ================= ADMIN ================= */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/upload"
        element={
          <AdminRoute>
            <AdminUpload />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/years"
        element={
          <AdminRoute>
            <ManageYears />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/semesters"
        element={
          <AdminRoute>
            <ManageSemesters />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/subjects"
        element={
          <AdminRoute>
            <ManageSubjects />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/notes"
        element={
          <AdminRoute>
            <ManageNotes />
          </AdminRoute>
        }
      />

      {/* ================= FALLBACK ================= */}
      <Route
        path="*"
        element={
          token ? <Navigate to="/notes" replace /> : <Navigate to="/login" replace />
        }
      />
      <Route path="/dashboard" element={<UserDashboard />} />
    </Routes>
    
  );
}

export default App;
