const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema({
  name: String,
  licensePlate: { type: String, unique: true },
  maxCapacity: Number,
  odometer: Number,
  status: {
    type: String,
    enum: ["AVAILABLE", "DISPATCHED", "IN_SHOP", "OUT_OF_SERVICE"],
    default: "AVAILABLE",
  },
});

module.exports = mongoose.model("Vehicle", vehicleSchema);