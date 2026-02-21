const express = require("express");
const auth = require("../middleware/auth");
const role = require("../middleware/role");

const Vehicle = require("../db/model/Vehicle");
const Driver = require("../db/model/Driver");
const ServiceLog = require("../db/model/ServiceLog");
const User = require("../db/model/User");
const Trip = require("../db/model/Trip");

const router = express.Router();

/* ====================================
   GET ALL VEHICLES
==================================== */
router.get(
  "/",
  auth,
  role(["SAFETY"]),
  async (req, res) => {
    try {
      const vehicles = await Vehicle.find().sort({
        createdAt: -1,
      });
      res.json(vehicles);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

/* ====================================
   ADD VEHICLE
==================================== */
router.post(
  "/",
  auth,
  role(["SAFETY"]),
  async (req, res) => {
    try {
      const { name, licensePlate, maxCapacity, odometer } =
        req.body;

      const existing = await Vehicle.findOne({
        licensePlate,
      });

      if (existing) {
        return res
          .status(400)
          .json({ message: "License plate already exists" });
      }

      const vehicle = await Vehicle.create({
        name,
        licensePlate,
        maxCapacity,
        odometer,
      });

      res.status(201).json(vehicle);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

/* ====================================
   MOVE VEHICLE TO IN_SHOP
==================================== */
router.put(
  "/service/:id",
  auth,
  role(["SAFETY"]),
  async (req, res) => {
    try {
      const vehicle = await Vehicle.findById(
        req.params.id
      );

      if (!vehicle)
        return res
          .status(404)
          .json({ message: "Vehicle not found" });

      if (vehicle.status === "OUT_OF_SERVICE") {
        return res.status(400).json({
          message:
            "Vehicle is OUT OF SERVICE and cannot be serviced",
        });
      }

      vehicle.status = "IN_SHOP";
      await vehicle.save();

      res.json(vehicle);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

router.put(
  "/available/:id",
  auth,
  role(["MANAGER", "SAFETY"]),
  async (req, res) => {
    try {
      const vehicle = await Vehicle.findById(req.params.id);

      if (!vehicle)
        return res
          .status(404)
          .json({ message: "Vehicle not found" });

      // 1️⃣ Make vehicle AVAILABLE
      vehicle.status = "AVAILABLE";
      await vehicle.save();

      // 2️⃣ Find latest IN_SHOP service log
      const serviceLog = await ServiceLog.findOne({
        vehicle: vehicle._id,
        status: "IN_SHOP",
      }).sort({ createdAt: -1 });

      // 3️⃣ Mark service log as COMPLETED
      if (serviceLog) {
        serviceLog.status = "COMPLETED";
        await serviceLog.save();
      }

      res.json({
        message: "Vehicle is now AVAILABLE",
        vehicle,
        serviceLogUpdated: serviceLog ? true : false,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

router.post(
  "/service/:id",
  auth,
  role(["MANAGER", "SAFETY"]),
  async (req, res) => {
    try {
      const { description, cost, odometer } = req.body;

      const vehicle = await Vehicle.findById(req.params.id);
      if (!vehicle)
        return res.status(404).json({ message: "Vehicle not found" });

      // Create service log
      await ServiceLog.create({
        vehicle: vehicle._id,
        description,
        cost,
        odometer,
        status: "IN_SHOP",
      });

      vehicle.status = "IN_SHOP";
      await vehicle.save();

      res.json(vehicle);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

/* ====================================
   TOGGLE OUT OF SERVICE
==================================== */
router.put(
  "/toggle/:id",
  auth,
  role(["SAFETY"]),
  async (req, res) => {
    try {
      const vehicle = await Vehicle.findById(
        req.params.id
      );

      if (!vehicle)
        return res
          .status(404)
          .json({ message: "Vehicle not found" });

      vehicle.status =
        vehicle.status === "OUT_OF_SERVICE"
          ? "AVAILABLE"
          : "OUT_OF_SERVICE";

      await vehicle.save();

      res.json(vehicle);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

router.get(
  "/dashboard",
  auth,
  role(["SAFETY"]),
  async (req, res) => {
    try {
      /* ======================
         COUNTS
      ====================== */

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

      /* ======================
         RECENT TRIPS
      ====================== */

      const trips = await Trip.find()
        .populate("vehicle", "name")
        .populate("driver", "name")
        .sort({ createdAt: -1 })
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

module.exports = router;