import { useEffect, useState } from "react";

type VehicleType  = "TRUCK" | "VAN" | "BIKE";
type DriverStatus = "ON_DUTY" | "OFF_DUTY" | "SUSPENDED";

interface Driver {
  id: string;
  name: string;
  licenseNumber: string;
  vehicleTypes: VehicleType[];
  age: number;
  experience: number;
  totalKmDriven: number;
  status: DriverStatus;
}

const statusStyle: Record<DriverStatus, string> = {
  ON_DUTY:   "bg-green-50 text-green-600 border-green-200",
  OFF_DUTY:  "bg-yellow-50 text-yellow-600 border-yellow-200",
  SUSPENDED: "bg-red-50 text-red-600 border-red-200",
};

const inputCls =
  "w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition";

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium text-gray-600">{label}</label>
    {children}
  </div>
);

const emptyForm = {
  name: "", licenseNumber: "", vehicleTypes: [] as VehicleType[],
  age: 0, experience: 0, totalKmDriven: 0,
};

export default function DriversPage() {
  const [drivers, setDrivers]     = useState<Driver[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");
  const [formError, setFormError] = useState("");
  const [newDriver, setNewDriver] = useState(emptyForm);

  const token = localStorage.getItem("fleet_token") || "";
  const headers = { Authorization: token };

  const fetchDrivers = () => {
    setLoading(true);
    fetch("http://localhost:5000/api/safety/drivers", { headers })
      .then((r) => { if (!r.ok) throw new Error("Fetch failed"); return r.json(); })
      .then((data) =>
        setDrivers(data.map((d: any) => ({
          id: d._id, name: d.name, licenseNumber: d.licenseNumber,
          vehicleTypes: d.vehicleTypes, age: d.age,
          experience: d.experience, totalKmDriven: d.totalKmDriven, status: d.status,
        })))
      )
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(fetchDrivers, []);

  const handleAddDriver = async () => {
    if (!newDriver.name || !newDriver.licenseNumber) {
      setFormError("Name and license number are required.");
      return;
    }
    try {
      const res = await fetch("http://localhost:5000/api/safety/drivers", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...headers },
        body: JSON.stringify(newDriver),
      });
      if (!res.ok) throw new Error("Add failed");
      setShowModal(false);
      setFormError("");
      setNewDriver(emptyForm);
      fetchDrivers();
    } catch (err: any) {
      setFormError(err.message);
    }
  };

  const toggleDuty    = (id: string) => fetch(`http://localhost:5000/api/safety/drivers/duty/${id}`,    { method: "PUT", headers }).then(fetchDrivers);
  const toggleSuspend = (id: string) => fetch(`http://localhost:5000/api/safety/drivers/suspend/${id}`, { method: "PUT", headers }).then(fetchDrivers);

  const toggleVehicleType = (type: VehicleType) =>
    setNewDriver((prev) => ({
      ...prev,
      vehicleTypes: prev.vehicleTypes.includes(type)
        ? prev.vehicleTypes.filter((t) => t !== type)
        : [...prev.vehicleTypes, type],
    }));

  const setField = (field: keyof typeof emptyForm, val: string | number) =>
    setNewDriver((prev) => ({ ...prev, [field]: val }));

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Driver Registry</h1>
          <p className="mt-1 text-sm text-gray-500">Manage driver records, duty status, and suspensions.</p>
        </div>
        <button
          onClick={() => { setShowModal(true); setFormError(""); }}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition"
        >
          + Add Driver
        </button>
      </div>

      {error && (
        <p className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
      )}

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-500" />
          Loading drivers…
        </div>
      ) : drivers.length === 0 ? (
        <p className="text-sm text-gray-400">No drivers found.</p>
      ) : (
        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-400 border-b border-gray-100">
              <tr>
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">License</th>
                <th className="px-5 py-3">Vehicle Types</th>
                <th className="px-5 py-3">Experience</th>
                <th className="px-5 py-3">KM Driven</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {drivers.map((d) => (
                <tr key={d.id} className="hover:bg-gray-50 transition">
                  <td className="px-5 py-3 font-medium text-gray-900">{d.name}</td>
                  <td className="px-5 py-3 font-mono text-gray-500">{d.licenseNumber}</td>
                  <td className="px-5 py-3 text-gray-600">{d.vehicleTypes.join(", ")}</td>
                  <td className="px-5 py-3 text-gray-600">{d.experience} yrs</td>
                  <td className="px-5 py-3 text-gray-600">{d.totalKmDriven.toLocaleString()} km</td>
                  <td className="px-5 py-3">
                    <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusStyle[d.status]}`}>
                      {d.status.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleDuty(d.id)}
                        className="rounded-md border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600 hover:bg-blue-100 transition"
                      >
                        Toggle Duty
                      </button>
                      <button
                        onClick={() => toggleSuspend(d.id)}
                        className={`rounded-md border px-3 py-1 text-xs font-medium transition ${
                          d.status === "SUSPENDED"
                            ? "border-green-200 bg-green-50 text-green-600 hover:bg-green-100"
                            : "border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
                        }`}
                      >
                        {d.status === "SUSPENDED" ? "Activate" : "Suspend"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Add Driver Modal ── */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4"
          onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
        >
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-lg">
            <div className="mb-5">
              <h3 className="text-base font-semibold text-gray-900">Add New Driver</h3>
              <p className="mt-1 text-sm text-gray-500">Fill in the driver's details below.</p>
            </div>

            <div className="flex flex-col gap-4">
              <Field label="Driver Name">
                <input type="text" value={newDriver.name} placeholder="e.g. Raj Patel"
                  onChange={(e) => setField("name", e.target.value)} className={inputCls} />
              </Field>

              <Field label="License Number">
                <input type="text" value={newDriver.licenseNumber} placeholder="e.g. LIC-10482"
                  onChange={(e) => setField("licenseNumber", e.target.value)} className={inputCls} />
              </Field>

              <Field label="Vehicle Types Allowed">
                <div className="flex gap-2">
                  {(["TRUCK", "VAN", "BIKE"] as VehicleType[]).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => toggleVehicleType(type)}
                      className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                        newDriver.vehicleTypes.includes(type)
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-gray-50 text-gray-600 border-gray-300 hover:bg-gray-100"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </Field>

              <div className="grid grid-cols-3 gap-3">
                <Field label="Age">
                  <input type="number" value={newDriver.age || ""} placeholder="e.g. 30"
                    onChange={(e) => setField("age", Number(e.target.value))} className={inputCls} />
                </Field>
                <Field label="Exp. (yrs)">
                  <input type="number" value={newDriver.experience || ""} placeholder="e.g. 5"
                    onChange={(e) => setField("experience", Number(e.target.value))} className={inputCls} />
                </Field>
                <Field label="KM Driven">
                  <input type="number" value={newDriver.totalKmDriven || ""} placeholder="e.g. 50000"
                    onChange={(e) => setField("totalKmDriven", Number(e.target.value))} className={inputCls} />
                </Field>
              </div>

              {formError && (
                <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">{formError}</p>
              )}

              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => { setShowModal(false); setFormError(""); }}
                  className="flex-1 rounded-md border border-gray-300 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddDriver}
                  className="flex-1 rounded-md bg-blue-600 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition"
                >
                  Add Driver
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}