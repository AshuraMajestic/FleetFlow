import { useEffect, useState } from "react";

interface Cargo {
  _id: string;
  weight: number;
  pickup: string;
  drop: string;
}

interface Vehicle {
  _id: string;
  name: string;
  maxCapacity: number;
}

interface Driver {
  _id: string;
  name: string;
}

interface Trip {
  _id: string;
  cargo: any;
  vehicle: any;
  driver: any;
  status: string;
}

export default function DispatcherTrip() {
  const token = localStorage.getItem("fleet_token");

  const [cargoList, setCargoList] = useState<Cargo[]>([]);
  const [vehicleList, setVehicleList] = useState<Vehicle[]>([]);
  const [driverList, setDriverList] = useState<Driver[]>([]);
  const [tripList, setTripList] = useState<Trip[]>([]);

  const [selectedCargo, setSelectedCargo] = useState<Cargo | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);

  /* ================= FETCH INITIAL DATA ================= */
  useEffect(() => {
    fetchCargo();
    fetchTrips();
  }, []);

  const fetchCargo = async () => {
    const res = await fetch(
      "http://localhost:5000/api/dispatch/cargo",
      { headers: { Authorization: token || "" } }
    );
    const data = await res.json();
    setCargoList(data);
  };

  const fetchTrips = async () => {
    const res = await fetch(
      "http://localhost:5000/api/dispatch/trips",
      { headers: { Authorization: token || "" } }
    );
    const data = await res.json();
    setTripList(data);
  };

  const fetchVehicles = async (weight: number) => {
    const res = await fetch(
      `http://localhost:5000/api/dispatch/vehicles/${weight}`,
      { headers: { Authorization: token || "" } }
    );
    const data = await res.json();
    setVehicleList(data);
  };

  const fetchDrivers = async () => {
    const res = await fetch(
      "http://localhost:5000/api/dispatch/drivers",
      { headers: { Authorization: token || "" } }
    );
    const data = await res.json();
    setDriverList(data);
  };

  /* ================= CREATE TRIP ================= */
  const createTrip = async () => {
    if (!selectedCargo || !selectedVehicle || !selectedDriver) return;

    await fetch("http://localhost:5000/api/dispatch/trip", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token || "",
      },
      body: JSON.stringify({
        cargoId: selectedCargo._id,
        vehicleId: selectedVehicle._id,
        driverId: selectedDriver._id,
      }),
    });

    setSelectedCargo(null);
    setSelectedVehicle(null);
    setSelectedDriver(null);
    fetchCargo();
    fetchTrips();
  };

  const completeTrip = async (id: string) => {
    await fetch(
      `http://localhost:5000/api/dispatch/trip/complete/${id}`,
      {
        method: "PUT",
        headers: { Authorization: token || "" },
      }
    );
    fetchTrips();
  };

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-8">
        Dispatcher Trip Management
      </h1>

      {/* STEP 1 */}
      <div className="mb-6">
        <h2 className="font-semibold mb-2 text-gray-300">
          1️⃣ Select Cargo
        </h2>

        <select
          className="w-full bg-gray-800 text-white border border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => {
            const cargo = cargoList.find(
              (c) => c._id === e.target.value
            );
            setSelectedCargo(cargo || null);
            if (cargo) fetchVehicles(cargo.weight);
          }}
        >
          <option className="bg-gray-800">
            Select Cargo
          </option>

          {cargoList.map((c) => (
            <option
              key={c._id}
              value={c._id}
              className="bg-gray-800"
            >
              {c.pickup} → {c.drop} ({c.weight}kg)
            </option>
          ))}
        </select>
      </div>

      {/* STEP 2 */}
      {selectedCargo && (
        <div className="mb-6">
          <h2 className="font-semibold mb-2 text-gray-300">
            2️⃣ Select Vehicle
          </h2>

          <select
            className="w-full bg-gray-800 text-white border border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => {
              const vehicle = vehicleList.find(
                (v) => v._id === e.target.value
              );
              setSelectedVehicle(vehicle || null);
              fetchDrivers();
            }}
          >
            <option className="bg-gray-800">
              Select Vehicle
            </option>

            {vehicleList.map((v) => (
              <option
                key={v._id}
                value={v._id}
                className="bg-gray-800"
              >
                {v.name} (Capacity: {v.maxCapacity}kg)
              </option>
            ))}
          </select>
        </div>
      )}

      {/* STEP 3 */}
      {selectedVehicle && (
        <div className="mb-6">
          <h2 className="font-semibold mb-2 text-gray-300">
            3️⃣ Select Driver
          </h2>

          <select
            className="w-full bg-gray-800 text-white border border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => {
              const driver = driverList.find(
                (d) => d._id === e.target.value
              );
              setSelectedDriver(driver || null);
            }}
          >
            <option className="bg-gray-800">
              Select Driver
            </option>

            {driverList.map((d) => (
              <option
                key={d._id}
                value={d._id}
                className="bg-gray-800"
              >
                {d.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* START TRIP */}
      {selectedDriver && (
        <button
          onClick={createTrip}
          className="bg-green-600 hover:bg-green-700 transition px-5 py-3 rounded-lg font-semibold"
        >
          🚚 Start Trip
        </button>
      )}

      {/* TRIP TABLE */}
      <div className="mt-10 bg-gray-900 shadow-lg rounded-2xl overflow-hidden">
        <table className="w-full text-left text-gray-300">
          <thead className="bg-gray-800">
            <tr>
              <th className="p-4">Cargo</th>
              <th className="p-4">Vehicle</th>
              <th className="p-4">Driver</th>
              <th className="p-4">Status</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {tripList.map((t) => (
              <tr
                key={t._id}
                className="border-t border-gray-700 hover:bg-gray-800 transition"
              >
                <td className="p-4">
                  {t.cargo?.pickup} → {t.cargo?.drop}
                </td>

                <td className="p-4">{t.vehicle?.name}</td>

                <td className="p-4">{t.driver?.name}</td>

                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${t.status === "DISPATCHED"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : "bg-green-500/20 text-green-400"
                      }`}
                  >
                    {t.status}
                  </span>
                </td>

                <td className="p-4">
                  {t.status === "DISPATCHED" && (
                    <button
                      onClick={() =>
                        completeTrip(t._id)
                      }
                      className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-lg"
                    >
                      Complete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}