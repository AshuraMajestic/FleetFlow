import React from "react";

interface Driver {
  id: string;
  name: string;
  status: "ON_DUTY" | "OFF_DUTY" | "SUSPENDED";
}

interface Vehicle {
  id: string;
  name: string;
  status: "AVAILABLE" | "ON_TRIP" | "IN_SHOP";
}

interface Trip {
  id: string;
  vehicle: string;
  driver: string;
  status: "DISPATCHED" | "COMPLETED";
}

export default function SafetyDashboard() {
  // 🔹 Mock Data
  const drivers: Driver[] = [
    { id: "1", name: "Rahul", status: "ON_DUTY" },
    { id: "2", name: "Amit", status: "OFF_DUTY" },
    { id: "3", name: "Karan", status: "ON_DUTY" },
  ];

  const vehicles: Vehicle[] = [
    { id: "1", name: "Van-01", status: "AVAILABLE" },
    { id: "2", name: "Truck-02", status: "ON_TRIP" },
    { id: "3", name: "Bike-03", status: "AVAILABLE" },
  ];

  const trips: Trip[] = [
    { id: "T1", vehicle: "Van-01", driver: "Rahul", status: "DISPATCHED" },
    { id: "T2", vehicle: "Truck-02", driver: "Amit", status: "COMPLETED" },
  ];

  // 🔹 Calculations
  const totalDrivers = drivers.length;
  const totalVehicles = vehicles.length;

  const availableDrivers = drivers.filter(
    (d) => d.status === "ON_DUTY"
  ).length;

  const availableVehicles = vehicles.filter(
    (v) => v.status === "AVAILABLE"
  ).length;

  const availableBoth = Math.min(availableDrivers, availableVehicles);
  const getStatusColor = (status: string) => {
    switch (status) {
      case "On Trip":
        return "text-orange-400";
      case "Completed":
        return "text-green-400";
      case "Cancelled":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };
  return (
    <div className="p-6">
      {/* Header */}
      <h1 className="text-2xl font-bold mb-6">Safety Dashboard</h1>

      {/* 🔷 Top 3 Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Drivers */}
        <div className="bg-white shadow-lg rounded-2xl p-6">
          <h2 className="text-gray-500 text-sm">Total Drivers</h2>
          <p className="text-3xl font-bold mt-2">{totalDrivers}</p>
        </div>

        {/* Vehicles */}
        <div className="bg-white shadow-lg rounded-2xl p-6">
          <h2 className="text-gray-500 text-sm">Total Vehicles</h2>
          <p className="text-3xl font-bold mt-2">{totalVehicles}</p>
        </div>

        {/* Available */}
        <div className="bg-white shadow-lg rounded-2xl p-6">
          <h2 className="text-gray-500 text-sm">
            Available for Dispatch
          </h2>
          <p className="text-3xl font-bold mt-2 text-green-600">
            {availableBoth}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-700 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-900 border-b border-gray-700">
            <tr>
              <th className="px-6 py-4 text-pink-400">Trip</th>
              <th className="px-6 py-4 text-pink-400">Vehicle</th>
              <th className="px-6 py-4 text-pink-400">Driver</th>
              <th className="px-6 py-4 text-pink-400">Status</th>
            </tr>
          </thead>
          <tbody>
            {trips.map((trip) => (
              <tr
                key={trip.id}
                className="border-b border-gray-800 hover:bg-gray-900 transition"
              >
                <td className="px-6 py-4 text-white">{trip.id}</td>
                <td className="px-6 py-4 text-white">{trip.vehicle}</td>
                <td className="px-6 py-4 text-white">{trip.driver}</td>
                <td
                  className={`px-6 py-4 font-semibold ${getStatusColor(
                    trip.status
                  )}`}
                >
                  {trip.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}