import { useEffect, useState } from "react";

type Stats = {
  activeFleet: number;
  maintenanceAlerts: number;
  pendingCargo: number;
};

type Trip = {
  id: string;
  vehicle: string;
  driver: string;
  status: string;
};

const statusStyle: Record<string, string> = {
  "On Trip":   "bg-orange-50 text-orange-600 border-orange-200",
  "Completed": "bg-green-50 text-green-600 border-green-200",
  "Cancelled": "bg-red-50 text-red-600 border-red-200",
};

const StatCard = ({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent: string;
}) => (
  <div className="rounded-xl border border-gray-200 bg-white p-5">
    <p className={`text-xs font-semibold uppercase tracking-wide ${accent}`}>{label}</p>
    <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
  </div>
);

export const Dashboard = () => {
  const [stats, setStats] = useState<Stats>({
    activeFleet: 0,
    maintenanceAlerts: 0,
    pendingCargo: 0,
  });
  const [trips, setTrips] = useState<Trip[]>([]);

  const token = localStorage.getItem("fleet_token") || "";

  useEffect(() => {
    fetch("http://localhost:5000/api/admin/trips", {
      headers: { Authorization: token },
    })
      .then((r) => r.json())
      .then(setTrips);
  }, []);

  useEffect(() => {
    fetch("http://localhost:5000/api/admin/stats", {
      headers: { Authorization: token },
    })
      .then((r) => r.json())
      .then(setStats);
  }, []);

  return (
    <div className="p-6">
      <h1 className="mb-1 text-xl font-semibold text-gray-900">Analytics Overview</h1>
      <p className="mb-6 text-sm text-gray-500">Live fleet and trip summary.</p>

      {/* KPI Cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Active Fleet"       value={stats.activeFleet}       accent="text-green-600" />
        <StatCard label="Maintenance Alerts" value={stats.maintenanceAlerts} accent="text-yellow-600" />
        <StatCard label="Pending Cargo"      value={stats.pendingCargo}      accent="text-blue-600" />
      </div>

      {/* Trips Table */}
      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        <div className="border-b border-gray-100 px-5 py-4">
          <h2 className="text-sm font-semibold text-gray-700">Recent Trips</h2>
        </div>
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-400">
            <tr>
              <th className="px-5 py-3">Trip ID</th>
              <th className="px-5 py-3">Vehicle</th>
              <th className="px-5 py-3">Driver</th>
              <th className="px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {trips.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-5 py-8 text-center text-gray-400">
                  No trips found.
                </td>
              </tr>
            ) : (
              trips.map((trip) => (
                <tr key={trip.id} className="hover:bg-gray-50 transition">
                  <td className="px-5 py-3 font-mono text-gray-600">{trip.id}</td>
                  <td className="px-5 py-3 text-gray-800">{trip.vehicle}</td>
                  <td className="px-5 py-3 text-gray-800">{trip.driver}</td>
                  <td className="px-5 py-3">
                    <span
                      className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                        statusStyle[trip.status] ?? "bg-gray-50 text-gray-500 border-gray-200"
                      }`}
                    >
                      {trip.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
