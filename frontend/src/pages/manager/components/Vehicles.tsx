import { useState } from "react";

type VehicleStatus =
  | "AVAILABLE"
  | "ON_TRIP"
  | "IN_SHOP"
  | "OUT_OF_SERVICE";

interface Vehicle {
  id: string;
  name: string;
  licensePlate: string;
  capacity: number;
  odometer: number;
  status: VehicleStatus;
}

const Vehicles = () => {
  const [vehicles] = useState<Vehicle[]>([
    {
      id: "1",
      name: "Van-01",
      licensePlate: "UP32AB1234",
      capacity: 500,
      odometer: 12000,
      status: "AVAILABLE",
    },
    {
      id: "2",
      name: "Truck-12",
      licensePlate: "DL01XY9876",
      capacity: 2000,
      odometer: 54000,
      status: "ON_TRIP",
    },
    {
      id: "3",
      name: "Bike-07",
      licensePlate: "MH14CD4567",
      capacity: 80,
      odometer: 8000,
      status: "OUT_OF_SERVICE",
    },
  ]);

  const getStatusBadge = (status: VehicleStatus) => {
    switch (status) {
      case "AVAILABLE":
        return "bg-green-100 text-green-600";
      case "ON_TRIP":
        return "bg-orange-100 text-orange-600";
      case "IN_SHOP":
        return "bg-yellow-100 text-yellow-700";
      case "OUT_OF_SERVICE":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl text-white font-bold">Vehicles</h1>

      </div>

      {/* Table */}
      <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-4">Name / Model</th>
              <th className="px-6 py-4">License Plate</th>
              <th className="px-6 py-4">Max Capacity (kg)</th>
              <th className="px-6 py-4">Odometer (km)</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>

          <tbody>
            {vehicles.map((vehicle) => (
              <tr
                key={vehicle.id}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="px-6 py-4 font-medium">
                  {vehicle.name}
                </td>

                <td className="px-6 py-4">
                  {vehicle.licensePlate}
                </td>

                <td className="px-6 py-4">
                  {vehicle.capacity}
                </td>

                <td className="px-6 py-4">
                  {vehicle.odometer}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusBadge(
                      vehicle.status
                    )}`}
                  >
                    {vehicle.status.replace("_", " ")}
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

export default Vehicles;