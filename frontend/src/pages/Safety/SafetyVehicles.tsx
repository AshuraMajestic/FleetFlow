import { useState } from "react";

type VehicleStatus =
  | "AVAILABLE"
  | "DISPATCHED"
  | "IN_SHOP"
  | "OUT_OF_SERVICE";

interface Vehicle {
  id: string;
  name: string;
  licensePlate: string;
  maxCapacity: number; // kg
  odometer: number;
  status: VehicleStatus;
}

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([
    {
      id: "1",
      name: "Tata Ace",
      licensePlate: "MH12AB1234",
      maxCapacity: 500,
      odometer: 12000,
      status: "AVAILABLE",
    },
    {
      id: "2",
      name: "Ashok Leyland Truck",
      licensePlate: "DL05XY7890",
      maxCapacity: 5000,
      odometer: 45000,
      status: "DISPATCHED",
    },
  ]);

  const [showModal, setShowModal] = useState(false);

  const [newVehicle, setNewVehicle] = useState({
    name: "",
    licensePlate: "",
    maxCapacity: 0,
    odometer: 0,
  });

  // 🔹 Add Vehicle
  const handleAddVehicle = () => {
    if (!newVehicle.name || !newVehicle.licensePlate) return;

    const vehicle: Vehicle = {
      id: Date.now().toString(),
      name: newVehicle.name,
      licensePlate: newVehicle.licensePlate,
      maxCapacity: Number(newVehicle.maxCapacity),
      odometer: Number(newVehicle.odometer),
      status: "AVAILABLE",
    };

    setVehicles([...vehicles, vehicle]);
    setShowModal(false);
    setNewVehicle({
      name: "",
      licensePlate: "",
      maxCapacity: 0,
      odometer: 0,
    });
  };

  // 🔹 Add Service Log → Move to IN_SHOP
  const handleServiceLog = (id: string) => {
    setVehicles((prev) =>
      prev.map((v) =>
        v.id === id && v.status !== "OUT_OF_SERVICE"
          ? { ...v, status: "IN_SHOP" }
          : v
      )
    );
  };

  // 🔹 Toggle Out Of Service
  const handleToggleOutOfService = (id: string) => {
    setVehicles((prev) =>
      prev.map((v) =>
        v.id === id
          ? {
              ...v,
              status:
                v.status === "OUT_OF_SERVICE"
                  ? "AVAILABLE"
                  : "OUT_OF_SERVICE",
            }
          : v
      )
    );
  };

  const getStatusBadge = (status: VehicleStatus) => {
    switch (status) {
      case "AVAILABLE":
        return "bg-green-100 text-green-600";
      case "DISPATCHED":
        return "bg-blue-100 text-blue-600";
      case "IN_SHOP":
        return "bg-yellow-100 text-yellow-700";
      case "OUT_OF_SERVICE":
        return "bg-red-100 text-red-600";
      default:
        return "";
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Vehicle Registry</h1>

        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + Add Vehicle
        </button>
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
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {vehicles.map((vehicle) => (
              <tr key={vehicle.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium">
                  {vehicle.name}
                </td>

                <td className="px-6 py-4">
                  {vehicle.licensePlate}
                </td>

                <td className="px-6 py-4">
                  {vehicle.maxCapacity} kg
                </td>

                <td className="px-6 py-4">
                  {vehicle.odometer.toLocaleString()} km
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 text-sm rounded-full ${getStatusBadge(
                      vehicle.status
                    )}`}
                  >
                    {vehicle.status.replace("_", " ")}
                  </span>
                </td>

                <td className="px-6 py-4 flex gap-2">
                  {vehicle.status !== "OUT_OF_SERVICE" && (
                    <button
                      onClick={() => handleServiceLog(vehicle.id)}
                      className="px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                    >
                      Service Log
                    </button>
                  )}

                  <button
                    onClick={() =>
                      handleToggleOutOfService(vehicle.id)
                    }
                    className="px-3 py-1 bg-gray-700 text-white rounded-lg hover:bg-gray-800"
                  >
                    {vehicle.status === "OUT_OF_SERVICE"
                      ? "Restore"
                      : "Out of Service"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Vehicle Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl p-6 w-96 shadow-xl">
            <h2 className="text-xl font-bold mb-4">Add Vehicle</h2>

            <input
              type="text"
              placeholder="Name / Model"
              value={newVehicle.name}
              onChange={(e) =>
                setNewVehicle({
                  ...newVehicle,
                  name: e.target.value,
                })
              }
              className="w-full border px-4 py-2 rounded-lg mb-3"
            />

            <input
              type="text"
              placeholder="License Plate"
              value={newVehicle.licensePlate}
              onChange={(e) =>
                setNewVehicle({
                  ...newVehicle,
                  licensePlate: e.target.value,
                })
              }
              className="w-full border px-4 py-2 rounded-lg mb-3"
            />

            <input
              type="number"
              placeholder="Max Load Capacity (kg)"
              value={newVehicle.maxCapacity}
              onChange={(e) =>
                setNewVehicle({
                  ...newVehicle,
                  maxCapacity: Number(e.target.value),
                })
              }
              className="w-full border px-4 py-2 rounded-lg mb-3"
            />

            <input
              type="number"
              placeholder="Odometer (km)"
              value={newVehicle.odometer}
              onChange={(e) =>
                setNewVehicle({
                  ...newVehicle,
                  odometer: Number(e.target.value),
                })
              }
              className="w-full border px-4 py-2 rounded-lg mb-4"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleAddVehicle}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}