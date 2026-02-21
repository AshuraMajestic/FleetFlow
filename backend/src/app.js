require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

require("./db/conn"); // MongoDB connection

const app = express();
const PORT = process.env.PORT || 5000;

/* =============================
   MIDDLEWARE
============================= */

app.use(cors({
  origin: "http://localhost:5173", // change if needed
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* =============================
   ROUTES
============================= */

// Auth Routes
app.use("/api/auth", require("./routes/authRoutes"));

// User Management (Approve etc)
app.use("/api/users", require("./routes/userRoutes"));

// Vehicles
app.use("/api/vehicles", require("./routes/vehicleRoutes"));

// Drivers
app.use("/api/drivers", require("./routes/driverRoutes"));

// Trips
app.use("/api/trips", require("./routes/tripRoutes"));

// Service Logs
app.use("/api/service", require("./routes/serviceRoutes"));
app.use("/api/admin", require("./routes/managerRoutes"));
/* =============================
   HEALTH CHECK
============================= */

app.get("/", (req, res) => {
  res.send("🚀 FleetFlow Backend Running...");
});

/* =============================
   404 HANDLER
============================= */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

/* =============================
   GLOBAL ERROR HANDLER
============================= */

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong",
    error: err.message
  });
});

/* =============================
   START SERVER
============================= */

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});