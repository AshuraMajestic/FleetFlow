const express = require("express");
const auth = require("../middleware/auth");
const role = require("../middleware/role");
const Driver = require("../db/model/Driver");

const router = express.Router();

/* ====================================
   GET ALL DRIVERS
==================================== */
router.get("/", auth, role(["SAFETY"]), async (req, res) => {
  try {
    const drivers = await Driver.find().sort({ createdAt: -1 });
    res.json(drivers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ====================================
   ADD DRIVER
==================================== */
router.post("/", auth, role(["SAFETY"]), async (req, res) => {
  try {
    const existing = await Driver.findOne({
      licenseNumber: req.body.licenseNumber,
    });

    if (existing) {
      return res.status(400).json({
        message: "License already exists",
      });
    }

    const driver = await Driver.create(req.body);

    res.status(201).json(driver);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ====================================
   TOGGLE DUTY
==================================== */
router.put("/duty/:id", auth, role(["SAFETY"]), async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id);

    if (!driver)
      return res.status(404).json({ message: "Driver not found" });

    if (driver.status !== "SUSPENDED") {
      driver.status =
        driver.status === "ON_DUTY"
          ? "OFF_DUTY"
          : "ON_DUTY";
    }

    await driver.save();
    res.json(driver);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ====================================
   TOGGLE SUSPEND
==================================== */
router.put("/suspend/:id", auth, role(["SAFETY"]), async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id);

    if (!driver)
      return res.status(404).json({ message: "Driver not found" });

    driver.status =
      driver.status === "SUSPENDED"
        ? "OFF_DUTY"
        : "SUSPENDED";

    await driver.save();
    res.json(driver);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;