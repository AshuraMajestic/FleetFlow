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

export default function DispatcherDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("fleet_token");

  /* ===============================
     FETCH DASHBOARD DATA
  =============================== */
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          "http://localhost:5000/api/dispatch/dashboard",
          {
            headers: {
              Authorization: token || "",
            },
          }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch dashboard data");
        }

        const data = await res.json();

        setStats(data.stats);
        setTrips(data.trips);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  /* ===============================
     STATUS COLOR
  =============================== */
  const getStatusColor = (status: TripStatus) => {
    switch (status) {
      case "DISPATCHED":
        return "text-orange-500";
      case "COMPLETED":
        return "text-green-500";
      case "CANCELLED":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  /* ===============================
     UI
  =============================== */
  return (
    <div className="min-h-screen  p-6">
      <h1 className="text-2xl font-bold mb-6">
        Dispatch Dashboard
      </h1>

      {error && (
        <div className="bg-red-100 text-red-600 p-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <p>Loading dashboard...</p>
      ) : (
        <>
          {/* ===============================
              TOP 3 STATS
          =============================== */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white shadow-lg rounded-2xl p-6">
              <h2 className="text-gray-500 text-sm">
                Total Drivers
              </h2>
              <p className="text-3xl font-bold mt-2">
                {stats?.totalDrivers || 0}
              </p>
            </div>

            <div className="bg-white shadow-lg rounded-2xl p-6">
              <h2 className="text-gray-500 text-sm">
                Total Vehicles
              </h2>
              <p className="text-3xl font-bold mt-2">
                {stats?.totalVehicles || 0}
              </p>
            </div>

            <div className="bg-white shadow-lg rounded-2xl p-6">
              <h2 className="text-gray-500 text-sm">
                Available for Dispatch
              </h2>
              <p className="text-3xl font-bold mt-2 text-green-600">
                {stats?.availableForDispatch || 0}
              </p>
            </div>
          </div>

          {/* ===============================
              RECENT TRIPS TABLE
          =============================== */}
          <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-6 py-4">Trip ID</th>
                  <th className="px-6 py-4">Vehicle</th>
                  <th className="px-6 py-4">Driver</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>

              <tbody>
                {trips.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-6 text-center text-gray-500"
                    >
                      No recent trips
                    </td>
                  </tr>
                )}

                {trips.map((trip) => (
                  <tr
                    key={trip.id}
                    className="border-t hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      {trip.id}
                    </td>

                    <td className="px-6 py-4">
                      {trip.vehicle}
                    </td>

                    <td className="px-6 py-4">
                      {trip.driver}
                    </td>

                    <td
                      className={`px-6 py-4 font-semibold ${getStatusColor(
                        trip.status
                      )}`}
                    >
                      {trip.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}