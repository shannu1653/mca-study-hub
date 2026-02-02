import { useNavigate } from "react-router-dom";
import { removeToken } from "../utils/auth";

function Navbar() {
  const navigate = useNavigate();

  const isAdmin =
    localStorage.getItem("is_admin") === "true" ||
    localStorage.getItem("is_admin") === "True";

  const handleLogout = () => {
    removeToken();
    localStorage.removeItem("is_admin");
    window.location.href = "/";
  };

  const goDashboard = () => {
    navigate(isAdmin ? "/admin" : "/dashboard");
  };

  return (
    <div style={styles.nav}>
      {/* LEFT */}
      <div style={styles.left}>
        <h3 style={{ margin: 0 }}>MCA Study Point</h3>

        {/* 📊 MOBILE DASHBOARD BUTTON */}
        <button
          onClick={goDashboard}
          style={styles.mobileDashboard}
        >
          Dashboard
        </button>
      </div>

      {/* RIGHT */}
      <button onClick={handleLogout} style={styles.logout}>
        Logout
      </button>
    </div>
  );
}

/* ================= STYLES ================= */
const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 16px",
    backgroundColor: "#1e293b",
    color: "white",
  },

  left: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  /* 🔥 MOBILE ONLY */
  mobileDashboard: {
    background: "transparent",
    border: "1px solid #38bdf8",
    color: "#38bdf8",
    padding: "4px 10px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "13px",

    /* hide on desktop */
    display: "none",
  },

  logout: {
    background: "#ef4444",
    border: "none",
    color: "white",
    padding: "6px 12px",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

/* ================= MEDIA QUERY ================= */
if (window.innerWidth <= 768) {
  styles.mobileDashboard.display = "block";
}

export default Navbar;
