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
        path="/home"
        element={
          <ProtectedRoute>
            {!isAdmin ? (
              <Layout>
                <Home />
              </Layout>
            ) : (
              <Navigate to="/admin" replace />
            )}
          </ProtectedRoute>
        }
      />

      <Route
        path="/notes"
        element={
          <ProtectedRoute>
            <Layout>
              <Notes />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* ================= ADMIN ================= */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <Layout>
              <AdminDashboard />
            </Layout>
          </AdminRoute>
        }
      />

      <Route
        path="/admin/upload"
        element={
          <AdminRoute>
            <Layout>
              <AdminUpload />
            </Layout>
          </AdminRoute>
        }
      />

      <Route
        path="/admin/years"
        element={
          <AdminRoute>
            <Layout>
              <ManageYears />
            </Layout>
          </AdminRoute>
        }
      />

      <Route
        path="/admin/semesters"
        element={
          <AdminRoute>
            <Layout>
              <ManageSemesters />
            </Layout>
          </AdminRoute>
        }
      />

      <Route
        path="/admin/subjects"
        element={
          <AdminRoute>
            <Layout>
              <ManageSubjects />
            </Layout>
          </AdminRoute>
        }
      />

      <Route
        path="/admin/notes"
        element={
          <AdminRoute>
            <Layout>
              <ManageNotes />
            </Layout>
          </AdminRoute>
        }
      />

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
