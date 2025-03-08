const express = require("express");
const app = express();
const port = 3000;

app.use(express.json());
const mongoose = require("mongoose");
require("dotenv").config();

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.get("/api/status", (req, res) => {
  const dbState = mongoose.connection.readyState;
  const states = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  };

  res.json({
    status: states[dbState],
    message:
      states[dbState] === "connected" || states[dbState] === "connecting"
        ? "Database connection is healthy"
        : "Database connection is not established",
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
