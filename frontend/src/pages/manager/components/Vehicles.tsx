import { useEffect, useState } from "react";

type VehicleStatus = "AVAILABLE" | "DISPATCHED" | "IN_SHOP" | "OUT_OF_SERVICE";

interface Vehicle {
  id: string;
  name: string;
  licensePlate: string;
  maxCapacity: number;
  odometer: number;
  status: VehicleStatus;
}

const statusStyle: Record<VehicleStatus, string> = {
  AVAILABLE:      "bg-green-50 text-green-600 border-green-200",
  DISPATCHED:     "bg-orange-50 text-orange-600 border-orange-200",
  IN_SHOP:        "bg-yellow-50 text-yellow-600 border-yellow-200",
  OUT_OF_SERVICE: "bg-red-50 text-red-600 border-red-200",
};

const Vehicles = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("fleet_token") || "";

    fetch("http://localhost:5000/api/admin/vehicles", {
      headers: { Authorization: token },
    })
      .then((r) => {
        if (!r.ok) throw new Error("Failed to fetch vehicles");
        return r.json();
      })
      .then((data) =>
        setVehicles(
          data.map((v: any) => ({
            id: v._id,
            name: v.name,
            licensePlate: v.licensePlate,
            maxCapacity: v.maxCapacity,
            odometer: v.odometer,
            status: v.status,
          }))
        )
      )
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Vehicles</h1>
        <p className="mt-1 text-sm text-gray-500">
          View and manage all fleet vehicles.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-500" />
          Loading vehicles…
        </div>
      ) : vehicles.length === 0 ? (
        <p className="text-sm text-gray-400">No vehicles found.</p>
      ) : (
        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-400 border-b border-gray-100">
              <tr>
                <th className="px-5 py-3">Name / Model</th>
                <th className="px-5 py-3">License Plate</th>
                <th className="px-5 py-3">Max Capacity (kg)</th>
                <th className="px-5 py-3">Odometer (km)</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {vehicles.map((v) => (
                <tr key={v.id} className="hover:bg-gray-50 transition">
                  <td className="px-5 py-3 font-medium text-gray-900">{v.name}</td>
                  <td className="px-5 py-3 font-mono text-gray-500">{v.licensePlate}</td>
                  <td className="px-5 py-3 text-gray-600">{v.maxCapacity.toLocaleString()}</td>
                  <td className="px-5 py-3 text-gray-600">{v.odometer.toLocaleString()}</td>
                  <td className="px-5 py-3">
                    <span
                      className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                        statusStyle[v.status] ?? "bg-gray-50 text-gray-500 border-gray-200"
                      }`}
                    >
                      {v.status.replace(/_/g, " ")}
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