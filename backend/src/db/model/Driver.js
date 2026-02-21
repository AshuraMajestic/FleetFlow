const mongoose = require("mongoose");

const driverSchema = new mongoose.Schema({
  name: String,
  licenseNumber: { type: String, unique: true },
  vehicleTypes: [String],
  age: Number,
  experience: Number,
  totalKmDriven: Number,
  status: {
    type: String,
    enum: ["ON_DUTY", "OFF_DUTY", "SUSPENDED"],
    default: "OFF_DUTY",
  },
});

module.exports = mongoose.model("Driver", driverSchema);