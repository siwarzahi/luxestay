import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

import { loadStripe } from "@stripe/stripe-js";

import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  Checkbox,
  FormControlLabel,
} from "@mui/material";

// 🔥 Stripe public key
const stripePromise = loadStripe("YOUR_STRIPE_PUBLIC_KEY");

const Booking = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const room = state?.room;

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    country: "",
    city: "",
    address: "",
    zipCode: "",
    checkIn: state?.checkIn || "",
    checkOut: state?.checkOut || "",
    terms: false,
  });

  const [message, setMessage] = useState("");

  // ❌ si refresh page
  if (!state || !room) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h3>Aucune réservation trouvée ❌</h3>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.terms) {
      setMessage("Vous devez accepter les conditions ❌");
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user?._id;

      if (!userId) {
        setMessage("Utilisateur non connecté ❌");
        return;
      }

      // 🔥 1. Créer session Stripe côté backend
      const res = await axios.post(
        "http://localhost:5000/api/payment/create-checkout-session",
        {
          room,
          userId,
          checkIn: form.checkIn,
          checkOut: form.checkOut,
        }
      );

      // 🔥 2. Charger Stripe
      const stripe = await stripePromise;

      // 🔥 3. Redirection vers Stripe Checkout
      const result = await stripe.redirectToCheckout({
        sessionId: res.data.id,
      });

      if (result.error) {
        setMessage(result.error.message);
      }

    } catch (err) {
      console.log("PAYMENT ERROR:", err);
      setMessage("Erreur paiement ❌");
    }
  };

  return (
    <div style={styles.container}>
      <Card sx={styles.card}>
        <CardContent>
          <Typography variant="h5" align="center">
            Réservation de chambre
          </Typography>

          <Typography align="center" sx={{ mt: 1, mb: 2 }}>
            {room.name}
          </Typography>

          {message && (
            <Typography align="center" color="error" sx={{ mb: 2 }}>
              {message}
            </Typography>
          )}

          <form onSubmit={handleSubmit}>
            <Typography variant="h6">Informations client</Typography>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField label="Prénom" name="firstName" fullWidth onChange={handleChange} required />
              </Grid>

              <Grid item xs={6}>
                <TextField label="Nom" name="lastName" fullWidth onChange={handleChange} required />
              </Grid>

              <Grid item xs={6}>
                <TextField label="Téléphone" name="phone" fullWidth onChange={handleChange} />
              </Grid>

              <Grid item xs={6}>
                <TextField label="Email" name="email" type="email" fullWidth onChange={handleChange} required />
              </Grid>
            </Grid>

            <Typography variant="h6" sx={{ mt: 2 }}>
              Adresse
            </Typography>

            <TextField label="Pays" name="country" fullWidth margin="normal" onChange={handleChange} />
            <TextField label="Ville" name="city" fullWidth margin="normal" onChange={handleChange} />
            <TextField label="Adresse" name="address" fullWidth margin="normal" onChange={handleChange} />
            <TextField label="Code postal" name="zipCode" fullWidth margin="normal" onChange={handleChange} />

            <Typography variant="h6" sx={{ mt: 2 }}>
              Séjour
            </Typography>

            <TextField
              type="date"
              name="checkIn"
              fullWidth
              margin="normal"
              value={form.checkIn}
              onChange={handleChange}
            />

            <TextField
              type="date"
              name="checkOut"
              fullWidth
              margin="normal"
              value={form.checkOut}
              onChange={handleChange}
            />

            <FormControlLabel
              control={<Checkbox name="terms" onChange={handleChange} />}
              label="J'accepte les conditions de réservation"
            />

            <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
              Payer & Confirmer
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    padding: 20,
    background: "#f5f5f5",
  },
  card: {
    width: 600,
    borderRadius: 3,
    boxShadow: 3,
  },
};

export default Booking;