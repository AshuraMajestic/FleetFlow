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
  DISPATCHED:     "bg-blue-50 text-blue-600 border-blue-200",
  IN_SHOP:        "bg-yellow-50 text-yellow-600 border-yellow-200",
  OUT_OF_SERVICE: "bg-red-50 text-red-600 border-red-200",
};

const inputCls =
  "w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition";

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium text-gray-600">{label}</label>
    {children}
  </div>
);

const emptyVehicle  = { name: "", licensePlate: "", maxCapacity: 0, odometer: 0 };
const emptyService  = { description: "", cost: 0, odometer: 0 };

export default function VehiclesPage() {
  const [vehicles, setVehicles]               = useState<Vehicle[]>([]);
  const [loading, setLoading]                 = useState(true);
  const [error, setError]                     = useState("");
  const [formError, setFormError]             = useState("");
  const [showAddModal, setShowAddModal]       = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [newVehicle, setNewVehicle]           = useState(emptyVehicle);
  const [serviceData, setServiceData]         = useState(emptyService);

  const token   = localStorage.getItem("fleet_token") || "";
  const headers = { Authorization: token };

  const fetchVehicles = () => {
    setLoading(true);
    fetch("http://localhost:5000/api/safety", { headers })
      .then((r) => { if (!r.ok) throw new Error("Failed to fetch"); return r.json(); })
      .then((data) =>
        setVehicles(data.map((v: any) => ({
          id: v._id, name: v.name, licensePlate: v.licensePlate,
          maxCapacity: v.maxCapacity, odometer: v.odometer, status: v.status,
        })))
      )
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(fetchVehicles, []);

  const handleAddVehicle = async () => {
    if (!newVehicle.name || !newVehicle.licensePlate) {
      setFormError("Name and license plate are required.");
      return;
    }
    try {
      const res = await fetch("http://localhost:5000/api/safety", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...headers },
        body: JSON.stringify(newVehicle),
      });
      if (!res.ok) throw new Error("Add failed");
      setShowAddModal(false);
      setFormError("");
      setNewVehicle(emptyVehicle);
      fetchVehicles();
    } catch (err: any) { setFormError(err.message); }
  };

  const handleCreateService = async () => {
    if (!selectedVehicleId) return;
    if (!serviceData.description) { setFormError("Description is required."); return; }
    try {
      const res = await fetch(`http://localhost:5000/api/safety/service/${selectedVehicleId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...headers },
        body: JSON.stringify(serviceData),
      });
      if (!res.ok) throw new Error("Service failed");
      setShowServiceModal(false);
      setFormError("");
      setServiceData(emptyService);
      fetchVehicles();
    } catch (err: any) { setFormError(err.message); }
  };

  const handleMarkAvailable = (id: string) =>
    fetch(`http://localhost:5000/api/safety/available/${id}`, { method: "PUT", headers })
      .then(fetchVehicles).catch((err) => setError(err.message));

  const handleToggle = (id: string) =>
    fetch(`http://localhost:5000/api/safety/toggle/${id}`, { method: "PUT", headers })
      .then(fetchVehicles).catch((err) => setError(err.message));

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Vehicle Registry</h1>
          <p className="mt-1 text-sm text-gray-500">Manage vehicles, service logs, and availability.</p>
        </div>
        <button
          onClick={() => { setShowAddModal(true); setFormError(""); }}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition"
        >
          + Add Vehicle
        </button>
      </div>

      {error && (
        <p className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
      )}

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-500" />
          Loading vehicles…
        </div>
      ) : vehicles.length === 0 ? (
        <p className="text-sm text-gray-400">No vehicles found.</p>
      ) : (
        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-400 border-b border-gray-100">
              <tr>
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Plate</th>
                <th className="px-5 py-3">Capacity</th>
                <th className="px-5 py-3">Odometer</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {vehicles.map((v) => (
                <tr key={v.id} className="hover:bg-gray-50 transition">
                  <td className="px-5 py-3 font-medium text-gray-900">{v.name}</td>
                  <td className="px-5 py-3 font-mono text-gray-500">{v.licensePlate}</td>
                  <td className="px-5 py-3 text-gray-600">{v.maxCapacity.toLocaleString()} kg</td>
                  <td className="px-5 py-3 text-gray-600">{v.odometer.toLocaleString()} km</td>
                  <td className="px-5 py-3">
                    <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusStyle[v.status]}`}>
                      {v.status.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex gap-2">
                      {v.status === "AVAILABLE" && (
                        <button
                          onClick={() => { setSelectedVehicleId(v.id); setShowServiceModal(true); setFormError(""); }}
                          className="rounded-md border border-yellow-200 bg-yellow-50 px-3 py-1 text-xs font-medium text-yellow-600 hover:bg-yellow-100 transition"
                        >
                          Service
                        </button>
                      )}
                      {v.status === "IN_SHOP" && (
                        <button
                          onClick={() => handleMarkAvailable(v.id)}
                          className="rounded-md border border-green-200 bg-green-50 px-3 py-1 text-xs font-medium text-green-600 hover:bg-green-100 transition"
                        >
                          Mark Available
                        </button>
                      )}
                      <button
                        onClick={() => handleToggle(v.id)}
                        className={`rounded-md border px-3 py-1 text-xs font-medium transition ${
                          v.status === "OUT_OF_SERVICE"
                            ? "border-green-200 bg-green-50 text-green-600 hover:bg-green-100"
                            : "border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        {v.status === "OUT_OF_SERVICE" ? "Restore" : "Out of Service"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Add Vehicle Modal ── */}
      {showAddModal && (
        <ModalShell title="Add Vehicle" subtitle="Register a new vehicle to the fleet." onClose={() => { setShowAddModal(false); setFormError(""); }}>
          <Field label="Vehicle Name">
            <input type="text" value={newVehicle.name} placeholder="e.g. Tata Prima 4028"
              onChange={(e) => setNewVehicle({ ...newVehicle, name: e.target.value })} className={inputCls} />
          </Field>
          <Field label="License Plate">
            <input type="text" value={newVehicle.licensePlate} placeholder="e.g. MH12AB1234"
              onChange={(e) => setNewVehicle({ ...newVehicle, licensePlate: e.target.value })} className={inputCls} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Capacity (kg)">
              <input type="number" value={newVehicle.maxCapacity || ""} placeholder="e.g. 5000"
                onChange={(e) => setNewVehicle({ ...newVehicle, maxCapacity: Number(e.target.value) })} className={inputCls} />
            </Field>
            <Field label="Odometer (km)">
              <input type="number" value={newVehicle.odometer || ""} placeholder="e.g. 12000"
                onChange={(e) => setNewVehicle({ ...newVehicle, odometer: Number(e.target.value) })} className={inputCls} />
            </Field>
          </div>
          {formError && <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">{formError}</p>}
          <div className="flex gap-2 pt-1">
            <button onClick={() => { setShowAddModal(false); setFormError(""); }}
              className="flex-1 rounded-md border border-gray-300 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition">
              Cancel
            </button>
            <button onClick={handleAddVehicle}
              className="flex-1 rounded-md bg-blue-600 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition">
              Add Vehicle
            </button>
          </div>
        </ModalShell>
      )}

      {/* ── Service Modal ── */}
      {showServiceModal && (
        <ModalShell title="Create Service Log" subtitle="Log a maintenance or repair entry for this vehicle." onClose={() => { setShowServiceModal(false); setFormError(""); }}>
          <Field label="Service Reason">
            <input type="text" value={serviceData.description} placeholder="e.g. Oil change and tyre rotation"
              onChange={(e) => setServiceData({ ...serviceData, description: e.target.value })} className={inputCls} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Cost (₹)">
              <input type="number" value={serviceData.cost || ""} placeholder="e.g. 2500"
                onChange={(e) => setServiceData({ ...serviceData, cost: Number(e.target.value) })} className={inputCls} />
            </Field>
            <Field label="Odometer (km)">
              <input type="number" value={serviceData.odometer || ""} placeholder="e.g. 45000"
                onChange={(e) => setServiceData({ ...serviceData, odometer: Number(e.target.value) })} className={inputCls} />
            </Field>
          </div>
          {formError && <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">{formError}</p>}
          <div className="flex gap-2 pt-1">
            <button onClick={() => { setShowServiceModal(false); setFormError(""); }}
              className="flex-1 rounded-md border border-gray-300 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition">
              Cancel
            </button>
            <button onClick={handleCreateService}
              className="flex-1 rounded-md bg-blue-600 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition">
              Save Log
            </button>
          </div>
        </ModalShell>
      )}
    </div>
  );
}

/* ── Shared Modal Shell ── */
function ModalShell({ title, subtitle, onClose, children }: {
  title: string; subtitle?: string; onClose: () => void; children: React.ReactNode;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-lg">
        <div className="mb-5">
          <h3 className="text-base font-semibold text-gray-900">{title}</h3>
          {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
        </div>
        <div className="flex flex-col gap-4">{children}</div>
      </div>
    </div>
  );
}