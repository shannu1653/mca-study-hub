import { Navigate } from "react-router-dom";

function AdminRoute({ children }) {
  const token = localStorage.getItem("access");
  const isAdmin = localStorage.getItem("is_admin") === "true";

  // ❌ Not logged in or not admin
  if (!token || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default AdminRoute;
