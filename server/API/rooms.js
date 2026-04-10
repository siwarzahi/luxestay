const router = require("express").Router();
const Room = require("../../models/room");


// --- CRÉER UNE CHAMBRE ---
// @route POST api/rooms/add
const rooms = await Room.find();
res.json({ rooms });
router.post("/add", async (req, res) => {
  const { name, type, price, maxPeople, description } = req.body;

  if (!name || !type || !price || !maxPeople) {
    return res.status(400).json({
      status: "notok",
      msg: "Tous les champs obligatoires doivent être remplis",
    });
  }

  try {
    const newRoom = new Room({
      name,
      type,
      price,
      maxPeople,
      description,
    });

    const savedRoom = await newRoom.save();

    res.status(201).json({
      status: "ok",
      msg: "Chambre ajoutée avec succès",
      room: savedRoom,
    });
  } catch (err) {
    res.status(500).json({ status: "error", msg: "Erreur serveur" });
  }
});


// --- LIRE TOUTES LES CHAMBRES ---
// @route GET api/rooms/
router.get("/", async (req, res) => {
  try {
    const rooms = await Room.find();

    res.status(200).json({
      status: "ok",
      rooms,
    });
  } catch (err) {
    res.status(500).json({ status: "error", msg: "Erreur serveur" });
  }
});


// --- LIRE POUR DASHBOARD (STATISTIQUES) ---
// @route GET api/rooms/allRooms
router.get("/allRooms", async (req, res) => {
  try {
    const rooms = await Room.find();

    const data = rooms.map(r => ({
      name: r.name,
      type: r.type,
      price: r.price,
      capacity: r.maxPeople,
      available: r.available,
    }));

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ status: "error", msg: "Erreur serveur" });
  }
});


// --- MODIFIER UNE CHAMBRE ---
// @route PUT api/rooms/update/:id
router.put("/update/:id", async (req, res) => {
  try {
    const updatedRoom = await Room.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    if (!updatedRoom) {
      return res.status(404).json({
        status: "notok",
        msg: "Chambre non trouvée",
      });
    }

    res.status(200).json({
      status: "ok",
      msg: "Chambre modifiée",
      room: updatedRoom,
    });
  } catch (err) {
    res.status(500).json({ status: "error", msg: "Erreur serveur" });
  }
});


// --- SUPPRIMER UNE CHAMBRE ---
// @route DELETE api/rooms/delete/:id
router.delete("/delete/:id", async (req, res) => {
  try {
    const deletedRoom = await Room.findByIdAndDelete(req.params.id);

    if (!deletedRoom) {
      return res.status(404).json({
        status: "notok",
        msg: "Chambre non trouvée",
      });
    }

    res.status(200).json({
      status: "ok",
      msg: "Chambre supprimée",
    });
  } catch (err) {
    res.status(500).json({ status: "error", msg: "Erreur serveur" });
  }
});

module.exports = router;