import { useEffect, useState } from "react";

type VehicleStatus =
  | "AVAILABLE"
  | "DISPATCHED"
  | "IN_SHOP"
  | "OUT_OF_SERVICE";

interface Vehicle {
  id: string;
  name: string;
  licensePlate: string;
  maxCapacity: number;
  odometer: number;
  status: VehicleStatus;
}

const Vehicles = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  const getStatusBadge = (status: VehicleStatus) => {
    switch (status) {
      case "AVAILABLE":
        return "bg-green-100 text-green-600";
      case "DISPATCHED":
        return "bg-orange-100 text-orange-600";
      case "IN_SHOP":
        return "bg-yellow-100 text-yellow-700";
      case "OUT_OF_SERVICE":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const token = localStorage.getItem("fleet_token");

        const res = await fetch(
          "http://localhost:5000/api/admin/vehicles",
          {
            headers: {
              Authorization: token || "",
            },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch vehicles");

        const data = await res.json();

        // Map backend _id → id
        const formatted = data.map((v: any) => ({
          id: v._id,
          name: v.name,
          licensePlate: v.licensePlate,
          maxCapacity: v.maxCapacity,
          odometer: v.odometer,
          status: v.status,
        }));

        setVehicles(formatted);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl text-white font-bold">
          Vehicles
        </h1>
      </div>

      {loading ? (
        <p className="text-white">Loading vehicles...</p>
      ) : (
        <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-4">Name / Model</th>
                <th className="px-6 py-4">License Plate</th>
                <th className="px-6 py-4">
                  Max Capacity (kg)
                </th>
                <th className="px-6 py-4">
                  Odometer (km)
                </th>
                <th className="px-6 py-4">
                  Status
                </th>
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
                    {vehicle.maxCapacity}
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
      )}
    </div>
  );
};

export default Vehicles;