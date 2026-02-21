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

const statusStyle: Record<CargoStatus, string> = {
  PENDING:   "bg-yellow-50 text-yellow-600 border-yellow-200",
  COMPLETED: "bg-green-50 text-green-600 border-green-200",
};

const inputCls =
  "w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition";

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium text-gray-600">{label}</label>
    {children}
  </div>
);

const emptyForm = { weight: 0, pickup: "", drop: "", distance: 0, amount: 0 };

export default function DispatchCargo() {
  const [cargoList, setCargoList] = useState<Cargo[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [newCargo, setNewCargo] = useState(emptyForm);

  const token = localStorage.getItem("fleet_token") || "";

  const fetchCargo = () => {
    setLoading(true);
    fetch("http://localhost:5000/api/dispatch/cargo", {
      headers: { Authorization: token },
    })
      .then((r) => {
        if (!r.ok) throw new Error("Failed to fetch cargo");
        return r.json();
      })
      .then((data) =>
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
        )
      )
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(fetchCargo, []);

  const handleAddCargo = async () => {
    if (!newCargo.weight || !newCargo.pickup || !newCargo.drop || !newCargo.distance || !newCargo.amount) {
      setFormError("All fields are required.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/dispatch/cargo", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: token },
        body: JSON.stringify(newCargo),
      });
      if (!res.ok) throw new Error("Failed to add cargo");
      setShowModal(false);
      setFormError("");
      setNewCargo(emptyForm);
      fetchCargo();
    } catch (err: any) {
      setFormError(err.message);
    }
  };

  const set = (field: keyof typeof emptyForm) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setNewCargo({ ...newCargo, [field]: field === "pickup" || field === "drop" ? e.target.value : Number(e.target.value) });

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Dispatch Cargo</h1>
          <p className="mt-1 text-sm text-gray-500">Manage and track all cargo orders.</p>
        </div>
        <button
          onClick={() => { setShowModal(true); setFormError(""); }}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition"
        >
          + Add Cargo
        </button>
      </div>

      {error && (
        <p className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      )}

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-500" />
          Loading cargo…
        </div>
      ) : cargoList.length === 0 ? (
        <p className="text-sm text-gray-400">No cargo records found.</p>
      ) : (
        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-400 border-b border-gray-100">
              <tr>
                <th className="px-5 py-3">Weight (kg)</th>
                <th className="px-5 py-3">Pickup</th>
                <th className="px-5 py-3">Drop</th>
                <th className="px-5 py-3">Distance (km)</th>
                <th className="px-5 py-3">Amount (₹)</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {cargoList.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50 transition">
                  <td className="px-5 py-3 text-gray-700">{c.weight.toLocaleString()}</td>
                  <td className="px-5 py-3 text-gray-800">{c.pickup}</td>
                  <td className="px-5 py-3 text-gray-800">{c.drop}</td>
                  <td className="px-5 py-3 text-gray-700">{c.distance.toLocaleString()}</td>
                  <td className="px-5 py-3 font-semibold text-gray-800">₹{c.amount.toLocaleString()}</td>
                  <td className="px-5 py-3">
                    <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusStyle[c.status]}`}>
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Add Cargo Modal ── */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4"
          onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
        >
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-lg">
            <div className="mb-5">
              <h3 className="text-base font-semibold text-gray-900">Add Cargo</h3>
              <p className="mt-1 text-sm text-gray-500">Fill in the details for the new cargo order.</p>
            </div>

            <div className="flex flex-col gap-4">
              <Field label="Weight (kg)">
                <input type="number" value={newCargo.weight || ""} onChange={set("weight")} placeholder="e.g. 500" className={inputCls} />
              </Field>
              <Field label="Pickup Location">
                <input type="text" value={newCargo.pickup} onChange={set("pickup")} placeholder="e.g. Mumbai" className={inputCls} />
              </Field>
              <Field label="Drop Location">
                <input type="text" value={newCargo.drop} onChange={set("drop")} placeholder="e.g. Pune" className={inputCls} />
              </Field>
              <Field label="Distance (km)">
                <input type="number" value={newCargo.distance || ""} onChange={set("distance")} placeholder="e.g. 150" className={inputCls} />
              </Field>
              <Field label="Payment Amount (₹)">
                <input type="number" value={newCargo.amount || ""} onChange={set("amount")} placeholder="e.g. 3000" className={inputCls} />
              </Field>

              {formError && (
                <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                  {formError}
                </p>
              )}

              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => { setShowModal(false); setFormError(""); }}
                  className="flex-1 rounded-md border border-gray-300 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddCargo}
                  className="flex-1 rounded-md bg-blue-600 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition"
                >
                  Add Cargo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}