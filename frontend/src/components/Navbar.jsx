import { removeToken } from "../utils/auth";

function Navbar() {
  const handleLogout = () => {
    removeToken();
    localStorage.removeItem("is_admin");
    window.location.href = "/";
  };

  return (
    <div style={styles.nav}>
      <h3 style={{ margin: 0 }}>MCA Study Point</h3>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 24px",
    backgroundColor: "#1e293b",
    color: "white",
  },
};


export default Navbar;
