import { useEffect, useState } from "react";

type VehicleType = "TRUCK" | "VAN" | "BIKE";
type DriverStatus = "ON_DUTY" | "OFF_DUTY" | "SUSPENDED";

interface Driver {
  id: string;
  name: string;
  licenseNumber: string;
  vehicleTypes: VehicleType[];
  age: number;
  experience: number;
  totalKmDriven: number;
  status: DriverStatus;
}

export default function DriversPage() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("fleet_token");

  const [newDriver, setNewDriver] = useState({
    name: "",
    licenseNumber: "",
    vehicleTypes: [] as VehicleType[],
    age: 0,
    experience: 0,
    totalKmDriven: 0,
  });

  /* ================= FETCH DRIVERS ================= */
  const fetchDrivers = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        "http://localhost:5000/api/safety/drivers",
        {
          headers: { Authorization: token || "" },
        }
      );

      if (!res.ok) throw new Error("Fetch failed");

      const data = await res.json();

      setDrivers(
        data.map((d: any) => ({
          id: d._id,
          name: d.name,
          licenseNumber: d.licenseNumber,
          vehicleTypes: d.vehicleTypes,
          age: d.age,
          experience: d.experience,
          totalKmDriven: d.totalKmDriven,
          status: d.status,
        }))
      );
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  /* ================= ADD DRIVER ================= */
  const handleAddDriver = async () => {
    try {
      if (!newDriver.name || !newDriver.licenseNumber) {
        setError("Name and License are required");
        return;
      }

      const res = await fetch(
        "http://localhost:5000/api/safety/drivers",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token || "",
          },
          body: JSON.stringify(newDriver),
        }
      );

      if (!res.ok) throw new Error("Add failed");

      setShowModal(false);
      setNewDriver({
        name: "",
        licenseNumber: "",
        vehicleTypes: [],
        age: 0,
        experience: 0,
        totalKmDriven: 0,
      });

      fetchDrivers();
    } catch (err: any) {
      setError(err.message);
    }
  };

  /* ================= TOGGLE DUTY ================= */
  const toggleDuty = async (id: string) => {
    await fetch(
      `http://localhost:5000/api/safety/drivers/duty/${id}`,
      {
        method: "PUT",
        headers: { Authorization: token || "" },
      }
    );
    fetchDrivers();
  };

  /* ================= TOGGLE SUSPEND ================= */
  const toggleSuspend = async (id: string) => {
    await fetch(
      `http://localhost:5000/api/safety/drivers/suspend/${id}`,
      {
        method: "PUT",
        headers: { Authorization: token || "" },
      }
    );
    fetchDrivers();
  };

  /* ================= VEHICLE TYPE TOGGLE ================= */
  const handleVehicleTypeChange = (type: VehicleType) => {
    setNewDriver((prev) => ({
      ...prev,
      vehicleTypes: prev.vehicleTypes.includes(type)
        ? prev.vehicleTypes.filter((t) => t !== type)
        : [...prev.vehicleTypes, type],
    }));
  };

  const badge = (status: DriverStatus) => {
    const map = {
      ON_DUTY: "bg-green-100 text-green-600",
      OFF_DUTY: "bg-yellow-100 text-yellow-700",
      SUSPENDED: "bg-red-100 text-red-600",
    };
    return map[status];
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        Driver Registry
      </h1>

      {error && (
        <div className="bg-red-100 text-red-600 p-3 mb-4 rounded">
          {error}
        </div>
      )}

      <button
        onClick={() => setShowModal(true)}
        className="mb-4 bg-blue-600 text-white px-4 py-2 rounded-lg"
      >
        + Add Driver
      </button>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full bg-white shadow rounded-xl">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">License</th>
              <th className="p-3">Vehicle Types</th>
              <th className="p-3">Experience</th>
              <th className="p-3">KM Driven</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {drivers.map((d) => (
              <tr key={d.id} className="border-t">
                <td className="p-3">{d.name}</td>
                <td className="p-3">{d.licenseNumber}</td>
                <td className="p-3">
                  {d.vehicleTypes.join(", ")}
                </td>
                <td className="p-3">{d.experience} yrs</td>
                <td className="p-3">
                  {d.totalKmDriven.toLocaleString()} km
                </td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded ${badge(
                      d.status
                    )}`}
                  >
                    {d.status.replace("_", " ")}
                  </span>
                </td>
                <td className="p-3 flex gap-2">
                  <button
                    onClick={() => toggleDuty(d.id)}
                    className="bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    Toggle Duty
                  </button>

                  <button
                    onClick={() => toggleSuspend(d.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    {d.status === "SUSPENDED"
                      ? "Activate"
                      : "Suspend"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* ================= MODAL ================= */}
      {/* ================= MODAL ================= */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl p-6 w-[420px] shadow-xl">
            <h2 className="text-xl font-bold mb-6">
              Add New Driver
            </h2>

            {/* Name */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Driver Name
              </label>
              <input
                type="text"
                value={newDriver.name}
                onChange={(e) =>
                  setNewDriver({
                    ...newDriver,
                    name: e.target.value,
                  })
                }
                className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* License */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                License Number
              </label>
              <input
                type="text"
                value={newDriver.licenseNumber}
                onChange={(e) =>
                  setNewDriver({
                    ...newDriver,
                    licenseNumber: e.target.value,
                  })
                }
                className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Vehicle Types */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Vehicle Types Allowed
              </label>

              <div className="flex gap-2 flex-wrap">
                {["TRUCK", "VAN", "BIKE"].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() =>
                      handleVehicleTypeChange(type as VehicleType)
                    }
                    className={`px-3 py-1 rounded-full border text-sm ${newDriver.vehicleTypes.includes(
                      type as VehicleType
                    )
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-gray-100 hover:bg-gray-200"
                      }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Age */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Age
              </label>
              <input
                type="number"
                value={newDriver.age}
                onChange={(e) =>
                  setNewDriver({
                    ...newDriver,
                    age: Number(e.target.value),
                  })
                }
                className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Experience */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Driving Experience (Years)
              </label>
              <input
                type="number"
                value={newDriver.experience}
                onChange={(e) =>
                  setNewDriver({
                    ...newDriver,
                    experience: Number(e.target.value),
                  })
                }
                className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* KM Driven */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-1">
                Total KM Driven
              </label>
              <input
                type="number"
                value={newDriver.totalKmDriven}
                onChange={(e) =>
                  setNewDriver({
                    ...newDriver,
                    totalKmDriven: Number(e.target.value),
                  })
                }
                className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                onClick={handleAddDriver}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add Driver
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}