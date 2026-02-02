import { Routes, Route, Navigate } from "react-router-dom";

/* AUTH */
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";

/* ROUTES */
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";

/* LAYOUT */
import Layout from "./layout/Layout";

/* PUBLIC */
import Landing from "./pages/Landing";

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
  const token = localStorage.getItem("access_token"); // ✅ FIX
  const isAdmin = localStorage.getItem("is_admin") === "true";

  return (
    <Routes>
      {/* ================= PUBLIC ================= */}
      <Route
        path="/"
        element={token ? <Navigate to="/home" replace /> : <Landing />}
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

      {/* ================= AUTHENTICATED (USER + ADMIN) ================= */}
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/home" element={<Home />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/dashboard" element={<UserDashboard />} />
      </Route>

      {/* ================= ADMIN ONLY ================= */}
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
          token ? <Navigate to="/home" replace /> : <Navigate to="/" replace />
        }
      />
    </Routes>
  );
}

export default App;
