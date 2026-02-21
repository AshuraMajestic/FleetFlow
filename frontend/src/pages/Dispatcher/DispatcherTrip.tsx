import { useEffect, useState } from "react";

interface Cargo   { _id: string; weight: number; pickup: string; drop: string; }
interface Vehicle { _id: string; name: string; maxCapacity: number; }
interface Driver  { _id: string; name: string; }
interface Trip    { _id: string; cargo: any; vehicle: any; driver: any; status: string; }

const tripStatusStyle: Record<string, string> = {
  DISPATCHED: "bg-orange-50 text-orange-600 border-orange-200",
  COMPLETED:  "bg-green-50 text-green-600 border-green-200",
};

const selectCls =
  "w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition bg-white";

export default function DispatcherTrip() {
  const token = localStorage.getItem("fleet_token") || "";

  const [cargoList,   setCargoList]   = useState<Cargo[]>([]);
  const [vehicleList, setVehicleList] = useState<Vehicle[]>([]);
  const [driverList,  setDriverList]  = useState<Driver[]>([]);
  const [tripList,    setTripList]    = useState<Trip[]>([]);

  const [selectedCargo,   setSelectedCargo]   = useState<Cargo | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [selectedDriver,  setSelectedDriver]  = useState<Driver | null>(null);

  const headers = { Authorization: token };

  const fetchCargo   = () => fetch("http://localhost:5000/api/dispatch/cargo",   { headers }).then(r => r.json()).then(setCargoList);
  const fetchTrips   = () => fetch("http://localhost:5000/api/dispatch/trips",   { headers }).then(r => r.json()).then(setTripList);
  const fetchDrivers = () => fetch("http://localhost:5000/api/dispatch/drivers", { headers }).then(r => r.json()).then(setDriverList);
  const fetchVehicles = (weight: number) =>
    fetch(`http://localhost:5000/api/dispatch/vehicles/${weight}`, { headers }).then(r => r.json()).then(setVehicleList);

  useEffect(() => { fetchCargo(); fetchTrips(); }, []);

  const createTrip = async () => {
    if (!selectedCargo || !selectedVehicle || !selectedDriver) return;
    await fetch("http://localhost:5000/api/dispatch/trip", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...headers },
      body: JSON.stringify({
        cargoId:   selectedCargo._id,
        vehicleId: selectedVehicle._id,
        driverId:  selectedDriver._id,
      }),
    });
    setSelectedCargo(null);
    setSelectedVehicle(null);
    setSelectedDriver(null);
    fetchCargo();
    fetchTrips();
  };

  const completeTrip = async (id: string) => {
    await fetch(`http://localhost:5000/api/dispatch/trip/complete/${id}`, {
      method: "PUT",
      headers,
    });
    fetchTrips();
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-gray-900">Trip Management</h1>
        <p className="mt-1 text-sm text-gray-500">Assign cargo, vehicle, and driver to dispatch a trip.</p>
      </div>

      {/* ── Step-by-step dispatch form ── */}
      <div className="mb-8 rounded-xl border border-gray-200 bg-white p-5">
        <h2 className="mb-4 text-sm font-semibold text-gray-700">Dispatch a New Trip</h2>

        <div className="flex flex-col gap-4">
          {/* Step 1 – Cargo */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Step 1 — Select Cargo
            </label>
            <select
              className={selectCls}
              value={selectedCargo?._id ?? ""}
              onChange={(e) => {
                const cargo = cargoList.find(c => c._id === e.target.value) ?? null;
                setSelectedCargo(cargo);
                setSelectedVehicle(null);
                setSelectedDriver(null);
                if (cargo) fetchVehicles(cargo.weight);
              }}
            >
              <option value="">Select cargo…</option>
              {cargoList.map(c => (
                <option key={c._id} value={c._id}>
                  {c.pickup} → {c.drop} ({c.weight} kg)
                </option>
              ))}
            </select>
          </div>

          {/* Step 2 – Vehicle */}
          <div className={`flex flex-col gap-1 transition-opacity ${!selectedCargo ? "opacity-40 pointer-events-none" : ""}`}>
            <label className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Step 2 — Select Vehicle
            </label>
            <select
              className={selectCls}
              value={selectedVehicle?._id ?? ""}
              disabled={!selectedCargo}
              onChange={(e) => {
                const vehicle = vehicleList.find(v => v._id === e.target.value) ?? null;
                setSelectedVehicle(vehicle);
                setSelectedDriver(null);
                if (vehicle) fetchDrivers();
              }}
            >
              <option value="">Select vehicle…</option>
              {vehicleList.map(v => (
                <option key={v._id} value={v._id}>
                  {v.name} (Capacity: {v.maxCapacity} kg)
                </option>
              ))}
            </select>
          </div>

          {/* Step 3 – Driver */}
          <div className={`flex flex-col gap-1 transition-opacity ${!selectedVehicle ? "opacity-40 pointer-events-none" : ""}`}>
            <label className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Step 3 — Select Driver
            </label>
            <select
              className={selectCls}
              value={selectedDriver?._id ?? ""}
              disabled={!selectedVehicle}
              onChange={(e) => {
                const driver = driverList.find(d => d._id === e.target.value) ?? null;
                setSelectedDriver(driver);
              }}
            >
              <option value="">Select driver…</option>
              {driverList.map(d => (
                <option key={d._id} value={d._id}>{d.name}</option>
              ))}
            </select>
          </div>

          {/* Dispatch button */}
          <div className="pt-1">
            <button
              onClick={createTrip}
              disabled={!selectedCargo || !selectedVehicle || !selectedDriver}
              className="rounded-md bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              Dispatch Trip
            </button>
          </div>
        </div>
      </div>

      {/* ── Trip Table ── */}
      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        <div className="border-b border-gray-100 px-5 py-4">
          <h2 className="text-sm font-semibold text-gray-700">All Trips</h2>
        </div>
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-400 border-b border-gray-100">
            <tr>
              <th className="px-5 py-3">Cargo Route</th>
              <th className="px-5 py-3">Vehicle</th>
              <th className="px-5 py-3">Driver</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {tripList.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-gray-400">
                  No trips found.
                </td>
              </tr>
            ) : (
              tripList.map((t) => (
                <tr key={t._id} className="hover:bg-gray-50 transition">
                  <td className="px-5 py-3 text-gray-800">
                    {t.cargo?.pickup} → {t.cargo?.drop}
                  </td>
                  <td className="px-5 py-3 text-gray-700">{t.vehicle?.name}</td>
                  <td className="px-5 py-3 text-gray-700">{t.driver?.name}</td>
                  <td className="px-5 py-3">
                    <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                      tripStatusStyle[t.status] ?? "bg-gray-50 text-gray-500 border-gray-200"
                    }`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    {t.status === "DISPATCHED" && (
                      <button
                        onClick={() => completeTrip(t._id)}
                        className="rounded-md border border-green-200 bg-green-50 px-3 py-1 text-xs font-medium text-green-600 hover:bg-green-100 transition"
                      >
                        Mark Complete
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}