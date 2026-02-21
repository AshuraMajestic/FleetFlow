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

const Drivers = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);

  const isExpired = (date: string) => {
    return new Date(date) < new Date();
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
        return "bg-gray-100 text-gray-600";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const token = localStorage.getItem("fleet_token");

        const res = await fetch(
          "http://localhost:5000/api/admin/drivers",
          {
            headers: {
              Authorization: token || "",
            },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch drivers");

        const data = await res.json();

        const formatted = data.map((d: any) => ({
          id: d._id,
          name: d.name,
          licenseNumber: d.licenseNumber,
          licenseExpiry: d.licenseExpiry,
          safetyScore: d.safetyScore,
          status: d.status,
        }));

        setDrivers(formatted);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDrivers();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">
          Drivers
        </h1>
      </div>

      {loading ? (
        <p className="text-white">Loading drivers...</p>
      ) : (
        <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">License No.</th>
                <th className="px-6 py-4">Expiry Date</th>
                <th className="px-6 py-4">Compliance</th>
                <th className="px-6 py-4">Safety Score</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>

            <tbody>
              {drivers.map((driver) => {
                const expired = isExpired(driver.licenseExpiry);

                return (
                  <tr
                    key={driver.id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-4 font-medium">
                      {driver.name}
                    </td>

                    <td className="px-6 py-4">
                      {driver.licenseNumber}
                    </td>

                    <td className="px-6 py-4">
                      {new Date(
                        driver.licenseExpiry
                      ).toLocaleDateString()}
                    </td>

                    <td className="px-6 py-4">
                      {expired ? (
                        <span className="text-red-600 font-semibold">
                          Expired
                        </span>
                      ) : (
                        <span className="text-green-600 font-semibold">
                          Valid
                        </span>
                      )}
                    </td>

                    <td
                      className={`px-6 py-4 font-semibold ${getScoreColor(
                        driver.safetyScore
                      )}`}
                    >
                      {driver.safetyScore}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusBadge(
                          driver.status
                        )}`}
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