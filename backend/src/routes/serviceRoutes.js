const express = require("express");
const Vehicle = require("../db/model/Vehicle");
const auth = require("../middleware/auth");

const router = express.Router();

// Add Vehicle
router.post("/", auth, async (req, res) => {
  const vehicle = new Vehicle(req.body);
  const result = await vehicle.save();
  res.send(result);
});

// Get All Vehicles
router.get("/", auth, async (req, res) => {
  const vehicles = await Vehicle.find();
  res.send(vehicles);
});

// Service Log → Move to IN_SHOP
router.put("/service/:id", auth, async (req, res) => {
  const vehicle = await Vehicle.findByIdAndUpdate(
    req.params.id,
    { status: "IN_SHOP" },
    { new: true }
  );
  res.send(vehicle);
});

module.exports = router;