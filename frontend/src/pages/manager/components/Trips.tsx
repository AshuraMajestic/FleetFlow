import { useState } from "react";

type TripStatus = "DRAFT" | "DISPATCHED" | "COMPLETED" | "CANCELLED";

interface Trip {
  id: string;
  assignedBy: string;
  driver: string;
  vehicle: string;
  pointA: string;
  pointB: string;
  kilometers: number;
  cargoLoad: number;
  status: TripStatus;
}

const Trips = () => {
  const [trips] = useState<Trip[]>([
    {
      id: "TRIP-001",
      assignedBy: "Admin",
      driver: "John Doe",
      vehicle: "Van-01",
      pointA: "Delhi",
      pointB: "Lucknow",
      kilometers: 520,
      cargoLoad: 450,
      status: "DISPATCHED",
    },
    {
      id: "TRIP-002",
      assignedBy: "Dispatcher Alex",
      driver: "Emma Brown",
      vehicle: "Truck-12",
      pointA: "Mumbai",
      pointB: "Pune",
      kilometers: 150,
      cargoLoad: 1200,
      status: "COMPLETED",
    },
  ]);

  const getStatusBadge = (status: TripStatus) => {
    switch (status) {
      case "DRAFT":
        return "bg-gray-100 text-gray-600";
      case "DISPATCHED":
        return "bg-orange-100 text-orange-600";
      case "COMPLETED":
        return "bg-green-100 text-green-600";
      case "CANCELLED":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Trips</h1>

      </div>

      {/* Table */}
      <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-4">Trip ID</th>
              <th className="px-6 py-4">Assigned By</th>
              <th className="px-6 py-4">Driver</th>
              <th className="px-6 py-4">Vehicle</th>
              <th className="px-6 py-4">Point A</th>
              <th className="px-6 py-4">Point B</th>
              <th className="px-6 py-4">KM</th>
              <th className="px-6 py-4">Cargo (kg)</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>

          <tbody>
            {trips.map((trip) => (
              <tr
                key={trip.id}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="px-6 py-4 font-medium">
                  {trip.id}
                </td>

                <td className="px-6 py-4">
                  {trip.assignedBy}
                </td>

                <td className="px-6 py-4">
                  {trip.driver}
                </td>

                <td className="px-6 py-4">
                  {trip.vehicle}
                </td>

                <td className="px-6 py-4">
                  {trip.pointA}
                </td>

                <td className="px-6 py-4">
                  {trip.pointB}
                </td>

                <td className="px-6 py-4">
                  {trip.kilometers}
                </td>

                <td className="px-6 py-4">
                  {trip.cargoLoad}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusBadge(
                      trip.status
                    )}`}
                  >
                    {trip.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Trips;