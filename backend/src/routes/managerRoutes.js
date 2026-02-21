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
   GET DASHBOARD STATS
==================================== */

router.get(
  "/stats",
  auth,
  role(["MANAGER"]),
  async (req, res) => {
    try {
      const activeFleet = await Vehicle.countDocuments({
        status: "DISPATCHED",
      });

      const maintenanceAlerts = await Vehicle.countDocuments({
        status: "IN_SHOP",
      });

      const pendingCargo = await Trip.countDocuments({
        status: "DRAFT",
      });

      res.json({
        activeFleet,
        maintenanceAlerts,
        pendingCargo,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

/* ====================================
   GET RECENT TRIPS
==================================== */

router.get(
  "/trips",
  auth,
  role(["MANAGER"]),
  async (req, res) => {
    try {
      const trips = await Trip.find()
        .populate("vehicle", "name")
        .populate("driver", "name")
        .sort({ createdAt: -1 })
        .limit(10);

      const formattedTrips = trips.map((trip) => ({
        id: trip._id,
        vehicle: trip.vehicle?.name,
        driver: trip.driver?.name,
        status: trip.status,
      }));

      res.json(formattedTrips);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);
/* ====================================
   GET ALL VEHICLES
==================================== */
router.get(
  "/vehicles",
  auth,
  role(["MANAGER"]),
  async (req, res) => {
    try {
      const vehicles = await Vehicle.find().sort({ createdAt: -1 });
      res.json(vehicles);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);
/* ====================================
   GET ALL DRIVERS
==================================== */
router.get(
  "/drivers",
  auth,
  role(["MANAGER"]),
  async (req, res) => {
    try {
      const drivers = await Driver.find().sort({ createdAt: -1 });
      res.json(drivers);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

/* ====================================
   GET ALL USERS
==================================== */
router.get(
  "/users",
  auth,
  role(["MANAGER"]),
  async (req, res) => {
    try {
      const users = await User.find().select("-password");
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);
/* ====================================
   APPROVE USER
==================================== */
router.put(
  "/users/approve/:id",
  auth,
  role(["MANAGER"]),
  async (req, res) => {
    try {
      const user = await User.findByIdAndUpdate(
        req.params.id,
        { approved: true },
        { new: true }
      ).select("-password");

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({
        message: "User approved successfully",
        user,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);
/* ====================================
   REJECT USER
==================================== */
router.delete(
  "/users/reject/:id",
  auth,
  role(["MANAGER"]),
  async (req, res) => {
    try {
      const user = await User.findByIdAndDelete(req.params.id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({
        message: "User rejected and removed",
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

/* ====================================
   GET ALL SERVICE LOGS
==================================== */
router.get(
  "/service-logs",
  auth,
  role(["MANAGER"]),
  async (req, res) => {
    try {
      const logs = await ServiceLog.find()
        .populate("vehicle", "name licensePlate")
        .sort({ createdAt: -1 });

      const formattedLogs = logs.map((log) => ({
        id: log._id,
        vehicle: log.vehicle?.name,
        licensePlate: log.vehicle?.licensePlate,
        serviceType: log.serviceType,
        description: log.description,
        serviceDate: log.serviceDate,
        cost: log.cost,
        odometer: log.odometer,
        status: log.status,
      }));

      res.json(formattedLogs);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

module.exports = router;