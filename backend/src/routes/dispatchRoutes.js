const express = require("express");
const auth = require("../middleware/auth");
const role = require("../middleware/role");

const Vehicle = require("../db/model/Vehicle");
const Driver = require("../db/model/Driver");
const Trip = require("../db/model/Trip");
const Cargo = require("../db/model/cargo");

const router = express.Router();

/* ====================================
   DISPATCHER DASHBOARD
==================================== */
router.get(
  "/dashboard",
  auth,
  role(["DISPATCHER"]),
  async (req, res) => {
    try {
      const totalDrivers = await Driver.countDocuments();
      const totalVehicles = await Vehicle.countDocuments();

      const availableDrivers = await Driver.countDocuments({
        status: "ON_DUTY",
      });

      const availableVehicles = await Vehicle.countDocuments({
        status: "AVAILABLE",
      });

      const availableForDispatch = Math.min(
        availableDrivers,
        availableVehicles
      );

      const trips = await Trip.find()
        .populate("vehicle", "name")
        .populate("driver", "name")
        .sort({ createdAt: -1 }) // latest first
        .limit(5);

      const formattedTrips = trips.map((trip) => ({
        id: trip._id,
        vehicle: trip.vehicle?.name || "N/A",
        driver: trip.driver?.name || "N/A",
        status: trip.status,
      }));

      res.json({
        stats: {
          totalDrivers,
          totalVehicles,
          availableForDispatch,
        },
        trips: formattedTrips,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

/* ====================================
   GET ONLY PENDING CARGO
   SORTED SMALL → LARGE
==================================== */
router.get(
  "/cargo",
  auth,
  role(["DISPATCHER"]),
  async (req, res) => {
    try {
      const cargo = await Cargo.find({
        status: "PENDING", // 🔥 only pending
      }).sort({ weight: 1 }); // 🔥 small to large

      res.json(cargo);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

/* ====================================
   ADD CARGO
==================================== */
router.post(
  "/cargo",
  auth,
  role(["DISPATCHER"]),
  async (req, res) => {
    try {
      const { weight, pickup, drop, distance, amount } =
        req.body;

      if (!weight || !pickup || !drop || !distance || !amount) {
        return res
          .status(400)
          .json({ message: "All fields required" });
      }

      const cargo = await Cargo.create({
        weight,
        pickup,
        drop,
        distance,
        amount,
      });

      res.status(201).json(cargo);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

/* =========================================
   GET AVAILABLE VEHICLES BY WEIGHT
   SORTED SMALL → LARGE
========================================= */
router.get(
  "/vehicles/:weight",
  auth,
  role(["DISPATCHER"]),
  async (req, res) => {
    try {
      const vehicles = await Vehicle.find({
        maxCapacity: { $gte: Number(req.params.weight) },
        status: "AVAILABLE",
      }).sort({ maxCapacity: 1 }); // 🔥 small to large

      res.json(vehicles);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

/* =========================================
   GET AVAILABLE DRIVERS (FILTER BY VEHICLE TYPE)
========================================= */
router.get(
  "/drivers/:vehicleId",
  auth,
  role(["DISPATCHER"]),
  async (req, res) => {
    try {
      const vehicle = await Vehicle.findById(req.params.vehicleId);

      if (!vehicle)
        return res.status(404).json({ message: "Vehicle not found" });

      // Basic vehicle type detection from name
      let vehicleType = "TRUCK";
      const name = vehicle.name.toUpperCase();

      if (name.includes("VAN")) vehicleType = "VAN";
      if (name.includes("BIKE")) vehicleType = "BIKE";

      const drivers = await Driver.find({
        status: "ON_DUTY",
        vehicleTypes: vehicleType,
      }).sort({ experience: -1 }); // 🔥 experienced first

      res.json(drivers);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

/* =========================================
   CREATE TRIP
========================================= */
router.post(
  "/trip",
  auth,
  role(["DISPATCHER"]),
  async (req, res) => {
    try {
      const { cargoId, vehicleId, driverId } = req.body;

      const cargo = await Cargo.findById(cargoId);
      if (!cargo)
        return res.status(404).json({ message: "Cargo not found" });

      if (cargo.status !== "PENDING") {
        return res.status(400).json({
          message: "Cargo already dispatched or completed",
        });
      }

      const trip = await Trip.create({
        cargo: cargoId,
        vehicle: vehicleId,
        driver: driverId,
        cargoWeight: cargo.weight,
        status: "DISPATCHED",
      });

      // Update statuses
      cargo.status = "COMPLETED";
      await cargo.save();

      await Vehicle.findByIdAndUpdate(vehicleId, {
        status: "DISPATCHED",
      });

      await Driver.findByIdAndUpdate(driverId, {
        status: "OFF_DUTY",
      });

      res.status(201).json(trip);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

/* =========================================
   GET ALL TRIPS (LATEST FIRST)
========================================= */
router.get(
  "/trips",
  auth,
  role(["DISPATCHER"]),
  async (req, res) => {
    try {
      const trips = await Trip.find()
        .populate("cargo")
        .populate("vehicle", "name")
        .populate("driver", "name")
        .sort({ createdAt: -1 }); // 🔥 latest first

      res.json(trips);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

/* =========================================
   COMPLETE TRIP
========================================= */
router.put(
  "/trip/complete/:id",
  auth,
  role(["DISPATCHER"]),
  async (req, res) => {
    try {
      const trip = await Trip.findById(req.params.id);

      if (!trip)
        return res.status(404).json({ message: "Trip not found" });

      trip.status = "COMPLETED";
      await trip.save();

      await Vehicle.findByIdAndUpdate(trip.vehicle, {
        status: "AVAILABLE",
      });

      await Driver.findByIdAndUpdate(trip.driver, {
        status: "ON_DUTY",
      });

      res.json(trip);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

module.exports = router;