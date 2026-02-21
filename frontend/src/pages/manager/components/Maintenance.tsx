import { useState } from "react";

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
  const [records] = useState<MaintenanceRecord[]>([
    {
      id: "M-001",
      vehicle: "Van-01",
      licensePlate: "UP32AB1234",
      serviceType: "Oil Change",
      description: "Engine oil replaced",
      serviceDate: "2024-01-10",
      cost: 2500,
      odometer: 12000,
      status: "COMPLETED",
    },
    {
      id: "M-002",
      vehicle: "Truck-12",
      licensePlate: "DL01XY9876",
      serviceType: "Brake Repair",
      description: "Front brake pads replaced",
      serviceDate: "2024-02-05",
      cost: 7800,
      odometer: 54000,
      status: "IN_SHOP",
    },
  ]);

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
        <h1 className="text-2xl font-bold">Maintenance Logs</h1>

        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          + Add Service Log
        </button>
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