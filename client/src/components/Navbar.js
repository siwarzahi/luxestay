import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const name = localStorage.getItem("name");
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    localStorage.removeItem("user"); // si tu stockes l'user
    navigate("/login");
  };

  const handleMenuClick = (callback) => {
    callback();
    setMenuOpen(false);
  };

  return (
    <div style={styles.navbar}>
      <h3 style={{ cursor: "pointer" }} onClick={() => navigate("/home")}>
        luxeStay
      </h3>

      <div style={styles.menuContainer}>
        <span style={{ marginRight: 20 }}> {name}!</span>

        <button
          style={styles.menuButton}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ⋮
        </button>

        {menuOpen && (
          <div style={styles.dropdown}>
            <button
              style={styles.dropdownItem}
              onClick={() => handleMenuClick(() => navigate("/home"))}
            >
              Accueil
            </button>
            <button
              style={styles.dropdownItem}
              onClick={() => handleMenuClick(() => navigate("/rooms"))}
            >
              Chambres
            </button>
            <button
              style={styles.dropdownItem}
              onClick={() => handleMenuClick(handleLogout)}
            >
              Login /Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// **Définir styles après le composant**
const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 20px",
    backgroundColor: "#333",
    color: "#fff",
  },
  menuContainer: {
    display: "flex",
    alignItems: "center",
    position: "relative",
  },
  menuButton: {
    padding: "5px 10px",
    backgroundColor: "#555",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    fontSize: "20px",
    borderRadius: "5px",
    transition: "background-color 0.3s",
  },
  dropdown: {
    position: "absolute",
    top: "100%",
    right: 0,
    backgroundColor: "#444",
    border: "1px solid #555",
    borderRadius: "5px",
    marginTop: "5px",
    minWidth: "150px",
    zIndex: 1000,
    boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
  },
  dropdownItem: {
    display: "block",
    width: "100%",
    padding: "10px 15px",
    backgroundColor: "transparent",
    color: "#fff",
    border: "none",
    textAlign: "left",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
};

export default Navbar;