const mongoose = require("mongoose");

const driverSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    licenseNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },

    vehicleTypes: [
      {
        type: String,
        enum: ["TRUCK", "VAN", "BIKE"],
        required: true,
      },
    ],

    age: {
      type: Number,
      required: true,
      min: 18,
      max: 75,
    },

    experience: {
      type: Number,
      required: true,
      min: 0,
      max: 60,
    },

    totalKmDriven: {
      type: Number,
      default: 0,
      min: 0,
    },

    status: {
      type: String,
      enum: ["ON_DUTY", "OFF_DUTY", "SUSPENDED"],
      default: "OFF_DUTY",
    },

    // 🔥 Future Ready Fields
    assignedVehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      default: null,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Driver", driverSchema);