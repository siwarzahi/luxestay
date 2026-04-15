const express = require("express");
const router = express.Router();
const Room = require("../models/Rooms");


// =======================
// 🔍 SEARCH ROOMS
// =======================
router.post("/search", async (req, res) => {
  const { destination, checkIn, checkOut, guests } = req.body;

  try {
    // 1. filtre base (ville + capacité)
    let rooms = await Room.find({
      location: destination,
      maxPeople: { $gte: guests }
    });

    const start = checkIn ? new Date(checkIn) : null;
    const end = checkOut ? new Date(checkOut) : null;

    // 2. filtrage disponibilité
    if (start && end) {
      rooms = rooms.filter((room) => {
        if (!room.currentBookings || room.currentBookings.length === 0) {
          return true;
        }

        return room.currentBookings.every((booking) => {
          return (
            end < new Date(booking.fromDate) ||
            start > new Date(booking.toDate)
          );
        });
      });
    }

    res.json(rooms);

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});


// =======================
// 📦 BOOK ROOM
// =======================
router.post("/book", async (req, res) => {
  const { roomId, checkIn, checkOut, userId } = req.body;

  try {
    if (!roomId || !checkIn || !checkOut || !userId) {
      return res.status(400).json({
        message: "Missing fields"
      });
    }

    const room = await Room.findById(roomId);

    if (!room) {
      return res.status(404).json({
        message: "Room not found"
      });
    }

    const start = new Date(checkIn);
    const end = new Date(checkOut);

    // check disponibilité
    const isAvailable = room.currentBookings.every((booking) => {
      return (
        end < new Date(booking.fromDate) ||
        start > new Date(booking.toDate)
      );
    });

    if (!isAvailable) {
      return res.status(400).json({
        message: "Chambre déjà réservée"
      });
    }

    // ajout booking
    room.currentBookings.push({
      fromDate: start,
      toDate: end,
      userId,
    });

    await room.save();

    res.json({
      message: "Réservation réussie"
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;