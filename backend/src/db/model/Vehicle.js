const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    licensePlate: {
      type: String,
      required: true,
      unique: true,
    },
    maxCapacity: { type: Number, required: true },
    odometer: { type: Number, default: 0 },
    status: {
      type: String,
      enum: [
        "AVAILABLE",
        "DISPATCHED",
        "IN_SHOP",
        "OUT_OF_SERVICE",
      ],
      default: "AVAILABLE",
    },
  },
  { timestamps: true }
);


module.exports = mongoose.model("Vehicle", vehicleSchema);