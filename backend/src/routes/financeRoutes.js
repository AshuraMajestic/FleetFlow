const express = require("express");
const auth = require("../middleware/auth");
const role = require("../middleware/role");

const Trip = require("../db/model/Trip");
const ServiceLog = require("../db/model/ServiceLog")

const router = express.Router();

/* =========================================
   FINANCIAL DASHBOARD
========================================= */
router.get(
  "/",
  auth,
  role(["DISPATCHER", "FINANCE"]),
  async (req, res) => {
    try {
      const completedTrips = await Trip.find({
        status: "COMPLETED",
      }).populate("cargo");

      const completedServices = await ServiceLog.find({
        status: "COMPLETED",
      });

      // Total Revenue
      const totalRevenue = completedTrips.reduce(
        (sum, trip) => sum + (trip.cargo?.amount || 0),
        0
      );

      // Total Expenses
      const totalExpense = completedServices.reduce(
        (sum, log) => sum + (log.cost || 0),
        0
      );

      const profit = totalRevenue - totalExpense;

      // Monthly Breakdown (for chart)
      const monthlyData = {};

      completedTrips.forEach((trip) => {
        const month = trip.createdAt.toISOString().slice(0, 7);
        if (!monthlyData[month])
          monthlyData[month] = { revenue: 0, expense: 0 };

        monthlyData[month].revenue += trip.cargo?.amount || 0;
      });

      completedServices.forEach((log) => {
        const month = log.createdAt.toISOString().slice(0, 7);
        if (!monthlyData[month])
          monthlyData[month] = { revenue: 0, expense: 0 };

        monthlyData[month].expense += log.cost || 0;
      });

      const chartData = Object.keys(monthlyData).map((month) => ({
        month,
        revenue: monthlyData[month].revenue,
        expense: monthlyData[month].expense,
        profit:
          monthlyData[month].revenue -
          monthlyData[month].expense,
      }));

      res.json({
        summary: {
          totalRevenue,
          totalExpense,
          profit,
        },
        chartData,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

module.exports = router;