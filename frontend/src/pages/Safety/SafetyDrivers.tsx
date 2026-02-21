import { useState } from "react";

type VehicleType = "TRUCK" | "VAN" | "BIKE";

type DriverStatus = "ON_DUTY" | "OFF_DUTY" | "SUSPENDED";

interface Driver {
  id: string;
  name: string;
  licenseNumber: string;
  vehicleTypes: VehicleType[];
  age: number;
  experience: number; // years
  totalKmDriven: number;
  status: DriverStatus;
}

export default function DriversPage() {
  const [drivers, setDrivers] = useState<Driver[]>([
    {
      id: "1",
      name: "Rahul Sharma",
      licenseNumber: "DL12345678",
      vehicleTypes: ["TRUCK", "VAN"],
      age: 32,
      experience: 8,
      totalKmDriven: 120000,
      status: "ON_DUTY",
    },
  ]);

  const [showModal, setShowModal] = useState(false);

  const [newDriver, setNewDriver] = useState({
    name: "",
    licenseNumber: "",
    vehicleTypes: [] as VehicleType[],
    age: 0,
    experience: 0,
    totalKmDriven: 0,
  });

  // 🔹 Add Driver
  const handleAddDriver = () => {
    if (!newDriver.name || !newDriver.licenseNumber) return;

    const driver: Driver = {
      id: Date.now().toString(),
      name: newDriver.name,
      licenseNumber: newDriver.licenseNumber,
      vehicleTypes: newDriver.vehicleTypes,
      age: Number(newDriver.age),
      experience: Number(newDriver.experience),
      totalKmDriven: Number(newDriver.totalKmDriven),
      status: "OFF_DUTY",
    };

    setDrivers([...drivers, driver]);
    setShowModal(false);
    setNewDriver({
      name: "",
      licenseNumber: "",
      vehicleTypes: [],
      age: 0,
      experience: 0,
      totalKmDriven: 0,
    });
  };

  // 🔹 Toggle Suspend
  const toggleSuspend = (id: string) => {
    setDrivers((prev) =>
      prev.map((d) =>
        d.id === id
          ? {
              ...d,
              status:
                d.status === "SUSPENDED"
                  ? "OFF_DUTY"
                  : "SUSPENDED",
            }
          : d
      )
    );
  };

  // 🔹 Toggle Duty
  const toggleDuty = (id: string) => {
    setDrivers((prev) =>
      prev.map((d) =>
        d.id === id && d.status !== "SUSPENDED"
          ? {
              ...d,
              status:
                d.status === "ON_DUTY"
                  ? "OFF_DUTY"
                  : "ON_DUTY",
            }
          : d
      )
    );
  };

  const getStatusBadge = (status: DriverStatus) => {
    switch (status) {
      case "ON_DUTY":
        return "bg-green-100 text-green-600";
      case "OFF_DUTY":
        return "bg-yellow-100 text-yellow-700";
      case "SUSPENDED":
        return "bg-red-100 text-red-600";
      default:
        return "";
    }
  };

  const handleVehicleTypeChange = (type: VehicleType) => {
    setNewDriver((prev) => ({
      ...prev,
      vehicleTypes: prev.vehicleTypes.includes(type)
        ? prev.vehicleTypes.filter((t) => t !== type)
        : [...prev.vehicleTypes, type],
    }));
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Driver Registry</h1>

        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + Add Driver
        </button>
      </div>

      {/* Table */}
      <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">License</th>
              <th className="px-6 py-4">Vehicle Types</th>
              <th className="px-6 py-4">Age</th>
              <th className="px-6 py-4">Experience</th>
              <th className="px-6 py-4">KM Driven</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {drivers.map((driver) => (
              <tr key={driver.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4">{driver.name}</td>
                <td className="px-6 py-4">{driver.licenseNumber}</td>
                <td className="px-6 py-4">
                  {driver.vehicleTypes.join(", ")}
                </td>
                <td className="px-6 py-4">{driver.age}</td>
                <td className="px-6 py-4">
                  {driver.experience} yrs
                </td>
                <td className="px-6 py-4">
                  {driver.totalKmDriven.toLocaleString()} km
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${getStatusBadge(
                      driver.status
                    )}`}
                  >
                    {driver.status.replace("_", " ")}
                  </span>
                </td>
                <td className="px-6 py-4 flex gap-2">
                  <button
                    onClick={() => toggleDuty(driver.id)}
                    className="px-3 py-1 bg-blue-600 text-white rounded-lg"
                  >
                    Toggle Duty
                  </button>
                  <button
                    onClick={() => toggleSuspend(driver.id)}
                    className="px-3 py-1 bg-red-600 text-white rounded-lg"
                  >
                    {driver.status === "SUSPENDED"
                      ? "Activate"
                      : "Suspend"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Driver Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl p-6 w-96 shadow-xl">
            <h2 className="text-xl font-bold mb-4">Add Driver</h2>

            <input
              type="text"
              placeholder="Name"
              className="w-full border px-4 py-2 rounded-lg mb-3"
              onChange={(e) =>
                setNewDriver({ ...newDriver, name: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="License Number"
              className="w-full border px-4 py-2 rounded-lg mb-3"
              onChange={(e) =>
                setNewDriver({
                  ...newDriver,
                  licenseNumber: e.target.value,
                })
              }
            />

            <div className="mb-3">
              <p className="text-sm mb-1">Vehicle Types</p>
              {["TRUCK", "VAN", "BIKE"].map((type) => (
                <label key={type} className="mr-3 text-sm">
                  <input
                    type="checkbox"
                    onChange={() =>
                      handleVehicleTypeChange(type as VehicleType)
                    }
                  />{" "}
                  {type}
                </label>
              ))}
            </div>

            <input
              type="number"
              placeholder="Age"
              className="w-full border px-4 py-2 rounded-lg mb-3"
              onChange={(e) =>
                setNewDriver({
                  ...newDriver,
                  age: Number(e.target.value),
                })
              }
            />

            <input
              type="number"
              placeholder="Experience (years)"
              className="w-full border px-4 py-2 rounded-lg mb-3"
              onChange={(e) =>
                setNewDriver({
                  ...newDriver,
                  experience: Number(e.target.value),
                })
              }
            />

            <input
              type="number"
              placeholder="Total KM Driven"
              className="w-full border px-4 py-2 rounded-lg mb-4"
              onChange={(e) =>
                setNewDriver({
                  ...newDriver,
                  totalKmDriven: Number(e.target.value),
                })
              }
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleAddDriver}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
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