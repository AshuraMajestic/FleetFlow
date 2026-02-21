import { useEffect, useState } from "react";

type TripStatus = "DISPATCHED" | "COMPLETED" | "CANCELLED";

interface DashboardStats {
  totalDrivers: number;
  totalVehicles: number;
  availableForDispatch: number;
}

interface Trip {
  id: string;
  vehicle: string;
  driver: string;
  status: TripStatus;
}

const tripStatusStyle: Record<TripStatus, string> = {
  DISPATCHED: "bg-orange-50 text-orange-600 border-orange-200",
  COMPLETED:  "bg-green-50 text-green-600 border-green-200",
  CANCELLED:  "bg-red-50 text-red-600 border-red-200",
};

const StatCard = ({
  label,
  value,
  accent = "text-gray-900",
}: {
  label: string;
  value: number;
  accent?: string;
}) => (
  <div className="rounded-xl border border-gray-200 bg-white p-5">
    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">{label}</p>
    <p className={`mt-2 text-3xl font-bold ${accent}`}>{value}</p>
  </div>
);

export default function DispatcherDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("fleet_token") || "";

  useEffect(() => {
    fetch("http://localhost:5000/api/dispatch/dashboard", {
      headers: { Authorization: token },
    })
      .then((r) => {
        if (!r.ok) throw new Error("Failed to fetch dashboard data");
        return r.json();
      })
      .then((data) => {
        setStats(data.stats);
        setTrips(data.trips);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Dispatch Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Live overview of drivers, vehicles, and trips.</p>
      </div>

      {error && (
        <p className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      )}

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-500" />
          Loading dashboard…
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard label="Total Drivers"         value={stats?.totalDrivers || 0} />
            <StatCard label="Total Vehicles"        value={stats?.totalVehicles || 0} />
            <StatCard label="Available for Dispatch" value={stats?.availableForDispatch || 0} accent="text-green-600" />
          </div>

          {/* Trips Table */}
          <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
            <div className="border-b border-gray-100 px-5 py-4">
              <h2 className="text-sm font-semibold text-gray-700">Recent Trips</h2>
            </div>
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-400 border-b border-gray-100">
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
                      No recent trips.
                    </td>
                  </tr>
                ) : (
                  trips.map((trip) => (
                    <tr key={trip.id} className="hover:bg-gray-50 transition">
                      <td className="px-5 py-3 font-mono text-gray-500">{trip.id}</td>
                      <td className="px-5 py-3 text-gray-800">{trip.vehicle}</td>
                      <td className="px-5 py-3 text-gray-800">{trip.driver}</td>
                      <td className="px-5 py-3">
                        <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                          tripStatusStyle[trip.status] ?? "bg-gray-50 text-gray-500 border-gray-200"
                        }`}>
                          {trip.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}