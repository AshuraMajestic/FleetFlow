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

const Dashboard = () => {
  const [stats, setStats] = useState<Stats>({
    activeFleet: 0,
    maintenanceAlerts: 0,
    pendingCargo: 0,
  });

  const [trips, setTrips] = useState<Trip[]>([]);
  const getStatusColor = (status: string) => {
    switch (status) {
      case "On Trip":
        return "text-orange-400";
      case "Completed":
        return "text-green-400";
      case "Cancelled":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };
  useEffect(() => {
    const fetchTrips = async () => {
      const token = localStorage.getItem("fleet_token");

      const res = await fetch("http://localhost:5000/api/admin/trips", {
        headers: {
          Authorization: token || "",
        },
      });

      const data = await res.json();
      setTrips(data);
    };

    fetchTrips();
  }, []);
  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem("fleet_token");

      const res = await fetch("http://localhost:5000/api/admin/stats", {
        headers: {
          Authorization: token || "",
        },
      });

      const data = await res.json();
      setStats(data);
    };

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-6">

      {/* Header */}
      <h1 className="text-2xl font-bold mb-6">Analytics Overview</h1>

      {/* Top KPI Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

        <div className="rounded-2xl border border-gray-700 p-6 text-center shadow-lg">
          <h2 className="text-lg text-green-400 font-semibold">
            Active Fleet
          </h2>
          <p className="mt-4 text-3xl font-bold">
            {stats.activeFleet}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-700 p-6 text-center shadow-lg">
          <h2 className="text-lg text-yellow-400 font-semibold">
            Maintenance Alert
          </h2>
          <p className="mt-4 text-3xl font-bold">
            {stats.maintenanceAlerts}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-700 p-6 text-center shadow-lg">
          <h2 className="text-lg text-blue-400 font-semibold">
            Pending Cargo
          </h2>
          <p className="mt-4 text-3xl font-bold">
            {stats.pendingCargo}
          </p>
        </div>

      </div>

      {/* Trips Table */}
      <div className="rounded-2xl border border-gray-700 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-900 border-b border-gray-700">
            <tr>
              <th className="px-6 py-4 text-pink-400">Trip</th>
              <th className="px-6 py-4 text-pink-400">Vehicle</th>
              <th className="px-6 py-4 text-pink-400">Driver</th>
              <th className="px-6 py-4 text-pink-400">Status</th>
            </tr>
          </thead>
          <tbody>
            {trips.map((trip) => (
              <tr
                key={trip.id}
                className="border-b border-gray-800 hover:bg-gray-900 transition"
              >
                <td className="px-6 py-4">{trip.id}</td>
                <td className="px-6 py-4">{trip.vehicle}</td>
                <td className="px-6 py-4">{trip.driver}</td>
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

    </div>
  );
};

export default Dashboard;