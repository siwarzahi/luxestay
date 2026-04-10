const express = require("express");
const router = express.Router();
const Room = require("../models/Rooms");

router.post("/search", async (req, res) => {
  const { destination, checkIn, checkOut, guests } = req.body;

  try {
    // 1️⃣ Récupérer les chambres dans la bonne ville et avec assez de place
  let rooms = await Room.find({});
console.log("Toutes les chambres:", rooms);
    // 2️⃣ Filtrer selon la disponibilité pour les dates choisies
    if (checkIn && checkOut) {
      const start = new Date(checkIn);
      const end = new Date(checkOut);

      rooms = rooms.filter((room) => {
        // Si pas de réservation existante, chambre libre
        if (!room.currentBookings || room.currentBookings.length === 0) return true;

        // Vérifier que les dates demandées ne chevauchent aucune réservation
        const isAvailable = room.currentBookings.every((booking) => {
          return end < new Date(booking.fromDate) || start > new Date(booking.toDate);
        });

        return isAvailable;
      });
    }

    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
});

module.exports = router;