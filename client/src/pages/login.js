import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { TextField, Button, Card, CardContent, Typography } from "@mui/material";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/users/login",
        formData
      );

      if (res.data.token) {
        // ✅ save auth
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userId", res.data.userId);

        setMessage("Connexion réussie ✅");

        // 🔥 récupération data booking depuis Rooms
        const data = location.state;

        setTimeout(() => {
          if (data?.room) {
            // 👉 REDIRECTION VERS BOOKING
            navigate("/booking", {
              state: {
                room: data.room,
                checkIn: data.checkIn,
                checkOut: data.checkOut,
                guests: data.guests,
              },
            });
          } else {
            navigate("/");
          }
        }, 800);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Mot de passe incorrect ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "#f5f5f5" }}>
      <Card sx={{ width: 350, padding: 2, borderRadius: 3, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h5" align="center" gutterBottom>
            Bienvenue sur Luxestay
          </Typography>

          {message && (
            <Typography
              align="center"
              color={message.includes("réussie") ? "green" : "error"}
              sx={{ mb: 2 }}
            >
              {message}
            </Typography>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              label="Email"
              type="email"
              name="email"
              fullWidth
              margin="normal"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <TextField
              label="Mot de passe"
              type="password"
              name="password"
              fullWidth
              margin="normal"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 2 }}
              disabled={loading}
            >
              {loading ? "Connexion..." : "Se connecter"}
            </Button>
          </form>

          <Typography align="center" sx={{ mt: 2 }}>
            Pas encore de compte ?{" "}
            <span
              style={{ color: "#1976d2", cursor: "pointer" }}
              onClick={() => navigate("/register")}
            >
              S'inscrire
            </span>
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;