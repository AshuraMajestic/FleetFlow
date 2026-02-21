const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema({
  vehicle: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle" },
  driver: { type: mongoose.Schema.Types.ObjectId, ref: "Driver" },
  cargoWeight: Number,
  status: {
    type: String,
    enum: ["DRAFT", "DISPATCHED", "COMPLETED", "CANCELLED"],
    default: "DRAFT",
  },
});

module.exports = mongoose.model("Trip", tripSchema);