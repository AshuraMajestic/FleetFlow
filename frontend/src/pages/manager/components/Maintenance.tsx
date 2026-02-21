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

const Maintenance = () => {
  const [records, setRecords] = useState<MaintenanceRecord[]>([
  ]);
  useEffect(() => {
    const fetchLogs = async () => {
      const token = localStorage.getItem("fleet_token");

      const res = await fetch(
        "http://localhost:5000/api/admin/service-logs",
        {
          headers: {
            Authorization: token || "",
          },
        }
      );

      const data = await res.json();
      setRecords(data);
    };

    fetchLogs();
  }, []);

  const getStatusBadge = (status: MaintenanceStatus) => {
    switch (status) {
      case "IN_SHOP":
        return "bg-yellow-100 text-yellow-700";
      case "COMPLETED":
        return "bg-green-100 text-green-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Maintenance Logs</h1>

      </div>

      {/* Table */}
      <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-4">Log ID</th>
              <th className="px-6 py-4">Vehicle</th>
              <th className="px-6 py-4">License Plate</th>
              <th className="px-6 py-4">Service Type</th>
              <th className="px-6 py-4">Description</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Odometer</th>
              <th className="px-6 py-4">Cost (₹)</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>

          <tbody>
            {records.map((record) => (
              <tr
                key={record.id}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="px-6 py-4 font-medium">
                  {record.id}
                </td>

                <td className="px-6 py-4">
                  {record.vehicle}
                </td>

                <td className="px-6 py-4">
                  {record.licensePlate}
                </td>

                <td className="px-6 py-4">
                  {record.serviceType}
                </td>

                <td className="px-6 py-4">
                  {record.description}
                </td>

                <td className="px-6 py-4">
                  {record.serviceDate}
                </td>

                <td className="px-6 py-4">
                  {record.odometer}
                </td>

                <td className="px-6 py-4 font-semibold">
                  ₹{record.cost}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusBadge(
                      record.status
                    )}`}
                  >
                    {record.status.replace("_", " ")}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Maintenance;