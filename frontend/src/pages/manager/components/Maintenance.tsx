import { useEffect, useState } from "react";

type MaintenanceStatus = "IN_SHOP" | "COMPLETED";

interface MaintenanceRecord {
  id: string;
  vehicle: string;
  licensePlate: string;
  serviceType: string;
  description: string;
  serviceDate: string;
  cost: number;
  odometer: number;
  status: MaintenanceStatus;
}

const statusStyle: Record<MaintenanceStatus, string> = {
  IN_SHOP:   "bg-yellow-50 text-yellow-600 border-yellow-200",
  COMPLETED: "bg-green-50 text-green-600 border-green-200",
};

const Maintenance = () => {
  const [records, setRecords] = useState<MaintenanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("fleet_token") || "";

    fetch("http://localhost:5000/api/admin/service-logs", {
      headers: { Authorization: token },
    })
      .then((r) => {
        if (!r.ok) throw new Error("Failed to fetch logs");
        return r.json();
      })
      .then(setRecords)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Maintenance Logs</h1>
        <p className="mt-1 text-sm text-gray-500">Track all vehicle service and repair records.</p>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-500" />
          Loading records…
        </div>
      ) : records.length === 0 ? (
        <p className="text-sm text-gray-400">No maintenance records found.</p>
      ) : (
        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-400 border-b border-gray-100">
              <tr>
                <th className="px-5 py-3">Log ID</th>
                <th className="px-5 py-3">Vehicle</th>
                <th className="px-5 py-3">License Plate</th>
                <th className="px-5 py-3">Service Type</th>
                <th className="px-5 py-3">Description</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Odometer (km)</th>
                <th className="px-5 py-3">Cost (₹)</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {records.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50 transition">
                  <td className="px-5 py-3 font-mono text-gray-500">{r.id}</td>
                  <td className="px-5 py-3 font-medium text-gray-900">{r.vehicle}</td>
                  <td className="px-5 py-3 font-mono text-gray-500">{r.licensePlate}</td>
                  <td className="px-5 py-3 text-gray-700">{r.serviceType}</td>
                  <td className="px-5 py-3 text-gray-500 max-w-xs truncate">{r.description}</td>
                  <td className="px-5 py-3 text-gray-600">
                    {new Date(r.serviceDate).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-3 text-gray-600">{r.odometer.toLocaleString()}</td>
                  <td className="px-5 py-3 font-semibold text-gray-800">
                    ₹{r.cost.toLocaleString()}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                        statusStyle[r.status] ?? "bg-gray-50 text-gray-500 border-gray-200"
                      }`}
                    >
                      {r.status.replace("_", " ")}
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

export default Maintenance;