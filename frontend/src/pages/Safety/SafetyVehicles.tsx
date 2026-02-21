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

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] =
    useState<string | null>(null);

  const [error, setError] = useState("");

  const token = localStorage.getItem("fleet_token");

  const [newVehicle, setNewVehicle] = useState({
    name: "",
    licensePlate: "",
    maxCapacity: 0,
    odometer: 0,
  });

  const [serviceData, setServiceData] = useState({
    description: "",
    cost: 0,
    odometer: 0,
  });

  /* =====================================
     FETCH VEHICLES
  ===================================== */
  const fetchVehicles = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        "http://localhost:5000/api/safety",
        {
          headers: { Authorization: token || "" },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch");

      const data = await res.json();

      setVehicles(
        data.map((v: any) => ({
          id: v._id,
          name: v.name,
          licensePlate: v.licensePlate,
          maxCapacity: v.maxCapacity,
          odometer: v.odometer,
          status: v.status,
        }))
      );
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  /* =====================================
     ADD VEHICLE
  ===================================== */
  const handleAddVehicle = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/safety",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token || "",
          },
          body: JSON.stringify(newVehicle),
        }
      );

      if (!res.ok) throw new Error("Add failed");

      setShowAddModal(false);
      setNewVehicle({
        name: "",
        licensePlate: "",
        maxCapacity: 0,
        odometer: 0,
      });

      fetchVehicles();
    } catch (err: any) {
      setError(err.message);
    }
  };

  /* =====================================
     CREATE SERVICE LOG
  ===================================== */
  const handleCreateService = async () => {
    if (!selectedVehicleId) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/safety/service/${selectedVehicleId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token || "",
          },
          body: JSON.stringify(serviceData),
        }
      );

      if (!res.ok) throw new Error("Service failed");

      setShowServiceModal(false);
      setServiceData({
        description: "",
        cost: 0,
        odometer: 0,
      });

      fetchVehicles();
    } catch (err: any) {
      setError(err.message);
    }
  };

  /* =====================================
     MARK AVAILABLE
  ===================================== */
  const handleMarkAvailable = async (id: string) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/safety/available/${id}`,
        {
          method: "PUT",
          headers: { Authorization: token || "" },
        }
      );

      if (!res.ok) throw new Error("Update failed");

      fetchVehicles();
    } catch (err: any) {
      setError(err.message);
    }
  };

  /* =====================================
     TOGGLE OUT OF SERVICE
  ===================================== */
  const handleToggle = async (id: string) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/safety/toggle/${id}`,
        {
          method: "PUT",
          headers: { Authorization: token || "" },
        }
      );

      if (!res.ok) throw new Error("Toggle failed");

      fetchVehicles();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const badge = (status: VehicleStatus) => {
    const map: Record<VehicleStatus, string> = {
      AVAILABLE: "bg-green-100 text-green-600",
      DISPATCHED: "bg-blue-100 text-blue-600",
      IN_SHOP: "bg-yellow-100 text-yellow-700",
      OUT_OF_SERVICE: "bg-red-100 text-red-600",
    };
    return map[status];
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        Vehicle Registry
      </h1>

      {error && (
        <div className="bg-red-100 text-red-600 p-3 mb-4 rounded">
          {error}
        </div>
      )}

      <button
        onClick={() => setShowAddModal(true)}
        className="mb-4 bg-blue-600 text-white px-4 py-2 rounded"
      >
        + Add Vehicle
      </button>

      {loading ? (
        <p>Loading vehicles...</p>
      ) : (
        <table className="w-full bg-white shadow rounded-xl">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Plate</th>
              <th className="p-3">Capacity</th>
              <th className="p-3">Odometer</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {vehicles.map((v) => (
              <tr key={v.id} className="border-t">
                <td className="p-3">{v.name}</td>
                <td className="p-3">{v.licensePlate}</td>
                <td className="p-3">{v.maxCapacity} kg</td>
                <td className="p-3">
                  {v.odometer.toLocaleString()} km
                </td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded ${badge(
                      v.status
                    )}`}
                  >
                    {v.status.replace("_", " ")}
                  </span>
                </td>

                <td className="p-3 flex gap-2">
                  {v.status === "AVAILABLE" && (
                    <button
                      onClick={() => {
                        setSelectedVehicleId(v.id);
                        setShowServiceModal(true);
                      }}
                      className="bg-yellow-500 text-white px-3 py-1 rounded"
                    >
                      Service
                    </button>
                  )}

                  {v.status === "IN_SHOP" && (
                    <button
                      onClick={() =>
                        handleMarkAvailable(v.id)
                      }
                      className="bg-green-600 text-white px-3 py-1 rounded"
                    >
                      Mark Available
                    </button>
                  )}

                  <button
                    onClick={() => handleToggle(v.id)}
                    className="bg-gray-700 text-white px-3 py-1 rounded"
                  >
                    {v.status === "OUT_OF_SERVICE"
                      ? "Restore"
                      : "Out of Service"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* ================= ADD MODAL ================= */}
      {showAddModal && (
        <Modal
          title="Add Vehicle"
          onClose={() => setShowAddModal(false)}
        >
          <Input
            placeholder="Name"
            value={newVehicle.name}
            onChange={(e) =>
              setNewVehicle({
                ...newVehicle,
                name: e.target.value,
              })
            }
          />
          <Input
            placeholder="License Plate"
            value={newVehicle.licensePlate}
            onChange={(e) =>
              setNewVehicle({
                ...newVehicle,
                licensePlate: e.target.value,
              })
            }
          />
          <Input
            type="number"
            placeholder="Capacity"
            value={newVehicle.maxCapacity}
            onChange={(e) =>
              setNewVehicle({
                ...newVehicle,
                maxCapacity: Number(e.target.value),
              })
            }
          />
          <Input
            type="number"
            placeholder="Odometer"
            value={newVehicle.odometer}
            onChange={(e) =>
              setNewVehicle({
                ...newVehicle,
                odometer: Number(e.target.value),
              })
            }
          />

          <button
            onClick={handleAddVehicle}
            className="mt-3 bg-blue-600 text-white px-4 py-2 rounded"
          >
            Add
          </button>
        </Modal>
      )}

      {/* ================= SERVICE MODAL ================= */}
      {showServiceModal && (
        <Modal
          title="Create Service Log"
          onClose={() => setShowServiceModal(false)}
        >
          <Input
            placeholder="Service Reason"
            value={serviceData.description}
            onChange={(e) =>
              setServiceData({
                ...serviceData,
                description: e.target.value,
              })
            }
          />
          <Input
            type="number"
            placeholder="Cost"
            value={serviceData.cost}
            onChange={(e) =>
              setServiceData({
                ...serviceData,
                cost: Number(e.target.value),
              })
            }
          />
          <Input
            type="number"
            placeholder="Odometer"
            value={serviceData.odometer}
            onChange={(e) =>
              setServiceData({
                ...serviceData,
                odometer: Number(e.target.value),
              })
            }
          />

          <button
            onClick={handleCreateService}
            className="mt-3 bg-yellow-600 text-white px-4 py-2 rounded"
          >
            Save
          </button>
        </Modal>
      )}
    </div>
  );
}

/* ================= REUSABLE COMPONENTS ================= */

function Modal({
  title,
  children,
  onClose,
}: any) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl w-96">
        <h2 className="text-lg font-bold mb-4">
          {title}
        </h2>
        {children}
        <button
          onClick={onClose}
          className="mt-3 text-sm text-gray-500"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

function Input(props: any) {
  return (
    <input
      {...props}
      className="w-full border p-2 mb-3 rounded"
    />
  );
}