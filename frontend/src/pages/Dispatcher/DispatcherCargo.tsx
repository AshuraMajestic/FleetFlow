import { useEffect, useState } from "react";

type CargoStatus = "PENDING" | "COMPLETED";

interface Cargo {
  id: string;
  weight: number;
  pickup: string;
  drop: string;
  distance: number;
  amount: number;
  status: CargoStatus;
}

export default function DispatchCargo() {
  const [cargoList, setCargoList] = useState<Cargo[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("fleet_token");

  const [newCargo, setNewCargo] = useState({
    weight: 0,
    pickup: "",
    drop: "",
    distance: 0,
    amount: 0,
  });

  /* ================= FETCH CARGO ================= */
  const fetchCargo = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        "http://localhost:5000/api/dispatch/cargo",
        {
          headers: { Authorization: token || "" },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch cargo");

      const data = await res.json();

      setCargoList(
        data.map((c: any) => ({
          id: c._id,
          weight: c.weight,
          pickup: c.pickup,
          drop: c.drop,
          distance: c.distance,
          amount: c.amount,
          status: c.status,
        }))
      );
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCargo();
  }, []);

  /* ================= ADD CARGO ================= */
  const handleAddCargo = async () => {
    try {
      if (
        !newCargo.weight ||
        !newCargo.pickup ||
        !newCargo.drop ||
        !newCargo.distance ||
        !newCargo.amount
      ) {
        setError("All fields are required");
        return;
      }

      const res = await fetch(
        "http://localhost:5000/api/dispatch/cargo",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token || "",
          },
          body: JSON.stringify(newCargo),
        }
      );

      if (!res.ok) throw new Error("Failed to add cargo");

      setShowModal(false);
      setError("");

      setNewCargo({
        weight: 0,
        pickup: "",
        drop: "",
        distance: 0,
        amount: 0,
      });

      fetchCargo();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const badge = (status: CargoStatus) =>
    status === "COMPLETED"
      ? "bg-green-100 text-green-600"
      : "bg-yellow-100 text-yellow-700";

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        Dispatch Cargo
      </h1>

      {error && (
        <div className="bg-red-100 text-red-600 p-3 mb-4 rounded">
          {error}
        </div>
      )}

      <button
        onClick={() => setShowModal(true)}
        className="mb-6 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        + Add Cargo
      </button>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="bg-white shadow rounded-2xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4">Weight (kg)</th>
                <th className="p-4">Pickup</th>
                <th className="p-4">Drop</th>
                <th className="p-4">Distance (km)</th>
                <th className="p-4">Amount (₹)</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>

            <tbody>
              {cargoList.map((cargo) => (
                <tr key={cargo.id} className="border-t">
                  <td className="p-4">{cargo.weight}</td>
                  <td className="p-4">{cargo.pickup}</td>
                  <td className="p-4">{cargo.drop}</td>
                  <td className="p-4">{cargo.distance}</td>
                  <td className="p-4">₹{cargo.amount}</td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${badge(
                        cargo.status
                      )}`}
                    >
                      {cargo.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ================= ADD MODAL ================= */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded-2xl w-96 shadow-xl">
            <h2 className="text-xl font-bold mb-4">
              Add Cargo
            </h2>

            {/* Weight */}
            <label className="block text-sm font-medium mb-1">
              Weight (kg)
            </label>
            <input
              type="number"
              value={newCargo.weight}
              onChange={(e) =>
                setNewCargo({
                  ...newCargo,
                  weight: Number(e.target.value),
                })
              }
              className="w-full border px-4 py-2 rounded mb-3"
            />

            {/* Pickup */}
            <label className="block text-sm font-medium mb-1">
              Pickup Location
            </label>
            <input
              type="text"
              value={newCargo.pickup}
              onChange={(e) =>
                setNewCargo({
                  ...newCargo,
                  pickup: e.target.value,
                })
              }
              className="w-full border px-4 py-2 rounded mb-3"
            />

            {/* Drop */}
            <label className="block text-sm font-medium mb-1">
              Drop Location
            </label>
            <input
              type="text"
              value={newCargo.drop}
              onChange={(e) =>
                setNewCargo({
                  ...newCargo,
                  drop: e.target.value,
                })
              }
              className="w-full border px-4 py-2 rounded mb-3"
            />

            {/* Distance */}
            <label className="block text-sm font-medium mb-1">
              Distance (km)
            </label>
            <input
              type="number"
              value={newCargo.distance}
              onChange={(e) =>
                setNewCargo({
                  ...newCargo,
                  distance: Number(e.target.value),
                })
              }
              className="w-full border px-4 py-2 rounded mb-3"
            />

            {/* Amount */}
            <label className="block text-sm font-medium mb-1">
              Payment Amount (₹)
            </label>
            <input
              type="number"
              value={newCargo.amount}
              onChange={(e) =>
                setNewCargo({
                  ...newCargo,
                  amount: Number(e.target.value),
                })
              }
              className="w-full border px-4 py-2 rounded mb-4"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleAddCargo}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Add Cargo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}