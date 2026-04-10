const mongoose = require("mongoose");

// Sous-schema pour les réservations
const bookingSchema = new mongoose.Schema({
  fromDate: { type: Date, required: true },
  toDate: { type: Date, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" } // optionnel
});

const roomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  price: { type: Number, required: true },
  maxPeople: { type: Number, required: true },
  description: { type: String },
  imageUrls: [String],
  location: { type: String, required: true },   // pour filtrer par ville
  currentBookings: [bookingSchema]             // pour gérer les réservations existantes
});

module.exports = mongoose.model("Room", roomSchema);