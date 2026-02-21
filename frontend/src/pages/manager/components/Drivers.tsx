import { useEffect, useState } from "react";

type DriverStatus = "ON_DUTY" | "OFF_DUTY" | "SUSPENDED";

interface Driver {
  id: string;
  name: string;
  licenseNumber: string;
  licenseExpiry: string;
  safetyScore: number;
  status: DriverStatus;
}

const statusStyle: Record<DriverStatus, string> = {
  ON_DUTY:   "bg-green-50 text-green-600 border-green-200",
  OFF_DUTY:  "bg-yellow-50 text-yellow-600 border-yellow-200",
  SUSPENDED: "bg-red-50 text-red-600 border-red-200",
};

const scoreColor = (s: number) =>
  s >= 80 ? "text-green-600" : s >= 60 ? "text-yellow-600" : "text-red-600";

const isExpired = (date: string) => new Date(date) < new Date();

// Random future date between today and +3 years
const randomFutureDate = () => {
  const now = Date.now();
  const threeYears = 3 * 365 * 24 * 60 * 60 * 1000;
  return new Date(now + Math.random() * threeYears).toISOString();
};

const Drivers = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("fleet_token") || "";

    fetch("http://localhost:5000/api/admin/drivers", {
      headers: { Authorization: token },
    })
      .then((r) => {
        if (!r.ok) throw new Error("Failed to fetch drivers");
        return r.json();
      })
      .then((data) =>
        setDrivers(
          data.map((d: any) => ({
            id: d._id,
            name: d.name,
            licenseNumber: d.licenseNumber,
            licenseExpiry: randomFutureDate(), // mock until backend provides real expiry
            safetyScore: parseFloat((Math.random() * 100).toFixed(2)),
            status: d.status,
          }))
        )
      )
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Drivers</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage and monitor all registered drivers.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-500" />
          Loading drivers…
        </div>
      ) : drivers.length === 0 ? (
        <p className="text-sm text-gray-400">No drivers found.</p>
      ) : (
        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-400 border-b border-gray-100">
              <tr>
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">License No.</th>
                <th className="px-5 py-3">Expiry Date</th>
                <th className="px-5 py-3">Compliance</th>
                <th className="px-5 py-3">Safety Score</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {drivers.map((driver) => {
                const expired = isExpired(driver.licenseExpiry);
                return (
                  <tr key={driver.id} className="hover:bg-gray-50 transition">
                    <td className="px-5 py-3 font-medium text-gray-900">
                      {driver.name}
                    </td>
                    <td className="px-5 py-3 font-mono text-gray-500">
                      {driver.licenseNumber}
                    </td>
                    <td className="px-5 py-3 text-gray-600">
                      {new Date(driver.licenseExpiry).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                          expired
                            ? "bg-red-50 text-red-600 border-red-200"
                            : "bg-green-50 text-green-600 border-green-200"
                        }`}
                      >
                        {expired ? "Expired" : "Valid"}
                      </span>
                    </td>
                    <td className={`px-5 py-3 font-semibold ${scoreColor(driver.safetyScore)}`}>
                      {driver.safetyScore}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                          statusStyle[driver.status] ?? "bg-gray-50 text-gray-500 border-gray-200"
                        }`}
                      >
                        {driver.status.replace("_", " ")}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Drivers;