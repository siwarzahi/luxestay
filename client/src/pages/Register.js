import React, { useState } from "react";
import axios from "axios";

import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Alert
} from "@mui/material";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/register",
        formData
      );
      setMessage(response.data.msg);
      setError(false);
    } catch (error) {
      setMessage(error.response?.data?.msg || "Une erreur est survenue");
      setError(true);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <Paper elevation={6} sx={{ padding: 4, width: "100%" }}>
          <Typography variant="h5" align="center" gutterBottom>
            Inscription
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Username"
              name="username"
              margin="normal"
              value={formData.username}
              onChange={handleChange}
              required
            />

            <TextField
              fullWidth
              label="Email"
              type="email"
              name="email"
              margin="normal"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <TextField
              fullWidth
              label="Password"
              type="password"
              name="password"
              margin="normal"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
            >
              S'inscrire
            </Button>

            {message && (
              <Alert severity={error ? "error" : "success"} sx={{ mt: 2 }}>
                {message}
              </Alert>
            )}
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register;
