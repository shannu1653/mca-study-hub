import { Navigate } from "react-router-dom";

function AdminRoute({ children }) {
  const token = localStorage.getItem("access");
  const isAdmin = localStorage.getItem("is_admin") === "true";

  if (!token || !isAdmin) {
    return <Navigate to="/notes" replace />;
  }

  return children;
}

export default AdminRoute;
