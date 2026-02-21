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

app.use("/api/admin", require("./routes/managerRoutes"));

app.use("/api/safety", require("./routes/safetyRoutes"));
app.use("/api/safety/drivers", require("./routes/driverRoutes"));

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