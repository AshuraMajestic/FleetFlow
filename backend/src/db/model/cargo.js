const mongoose = require("mongoose");

const cargoSchema = new mongoose.Schema(
  {
    weight: {
      type: Number,
      required: true,
    },
    pickup: {
      type: String,
      required: true,
    },
     distance: {
      type: Number, // in KM
      required: true,
    },
    drop: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "COMPLETED"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cargo", cargoSchema);