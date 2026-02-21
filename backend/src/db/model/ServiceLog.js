const mongoose = require("mongoose");

const serviceLogSchema = new mongoose.Schema(
  {
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
    },
    serviceType: String,
    description: String,
    cost: Number,
    odometer: Number,
    status: {
      type: String,
      enum: ["IN_SHOP", "COMPLETED"],
      default: "IN_SHOP",
    },
    serviceDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("ServiceLog", serviceLogSchema);