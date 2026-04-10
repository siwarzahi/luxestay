const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
require("dotenv").config();
// Middlewares
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB error:", err));

// Routes
const roomsRoute = require("./routes/roomRoute");
const users = require("./routes/users");

app.use("/api/rooms", roomsRoute);
app.use("/api/users", users);

// Default route
app.get("/", (req, res) => {
  res.send("Server is running");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));