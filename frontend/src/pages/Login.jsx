import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";
import "../styles/login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  /* ✅ CLEAR OLD SESSION ON LOAD */
  useEffect(() => {
    const token = localStorage.getItem("access");

    if (token) {
      // already logged in
      const isAdmin = localStorage.getItem("is_admin") === "true";
      navigate(isAdmin ? "/admin" : "/home", { replace: true });
    } else {
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      localStorage.removeItem("is_admin");
      localStorage.removeItem("username");
    }
  }, [navigate]);

  /* ✅ SUBMIT */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);

    try {
      const res = await api.post("auth/login/", {
        email,
        password,
      });

      /* ✅ STORE AUTH */
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      localStorage.setItem(
        "is_admin",
        res.data.is_admin ? "true" : "false"
      );

      if (res.data.username) {
        localStorage.setItem("username", res.data.username);
      }

      toast.success("Welcome back 👋");

      navigate(res.data.is_admin ? "/admin" : "/home", {
        replace: true,
      });
    } catch (err) {
      const message =
        err.response?.data?.detail ||
        "Invalid email or password";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>MCA Study</h2>
        <p className="subtitle">Login to continue</p>

        <form onSubmit={handleSubmit}>
          {/* EMAIL */}
          <div className="input-group">
            <input
              type="email"
              required
              value={email}
              disabled={loading}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label>Email</label>
          </div>

          {/* PASSWORD */}
          <div className="input-group">
            <input
              type="password"
              required
              value={password}
              disabled={loading}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label>Password</label>
          </div>

          {/* BUTTON */}
          <button type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </button>

          {/* LINKS */}
          <p className="auth-link">
            New user?{" "}
            <span onClick={() => navigate("/register")}>
              Create account
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
