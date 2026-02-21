import { useEffect, useState } from "react";

type UserRole = "MANAGER" | "DISPATCHER" | "SAFETY" | "FINANCE";

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  address?: string;
  approved: boolean;
}

const roleBadge: Record<UserRole, string> = {
  MANAGER:    "bg-purple-50 text-purple-600 border-purple-200",
  DISPATCHER: "bg-blue-50 text-blue-600 border-blue-200",
  SAFETY:     "bg-yellow-50 text-yellow-600 border-yellow-200",
  FINANCE:    "bg-green-50 text-green-600 border-green-200",
};

const inputCls =
  "rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition";

const Users = () => {
  const [activeTab, setActiveTab] = useState<"REQUESTS" | "USERS">("REQUESTS");
  const [users, setUsers] = useState<User[]>([]);
  const [roleFilter, setRoleFilter] = useState<"ALL" | UserRole>("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("fleet_token") || "";

    fetch("http://localhost:5000/api/admin/users", {
      headers: { Authorization: token },
    })
      .then((r) => {
        if (!r.ok) throw new Error("Failed to fetch users");
        return r.json();
      })
      .then((data) =>
        setUsers(
          data.map((u: any) => ({
            id: u._id,
            name: u.name,
            email: u.email,
            role: u.role,
            phone: u.phone,
            address: u.address,
            approved: u.approved,
          }))
        )
      )
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleApprove = async (id: string) => {
    const token = localStorage.getItem("fleet_token") || "";
    const res = await fetch(`http://localhost:5000/api/admin/users/approve/${id}`, {
      method: "PUT",
      headers: { Authorization: token },
    });
    if (res.ok) setUsers((prev) => prev.map((u) => u.id === id ? { ...u, approved: true } : u));
  };

  const handleReject = async (id: string) => {
    const token = localStorage.getItem("fleet_token") || "";
    const res = await fetch(`http://localhost:5000/api/admin/users/reject/${id}`, {
      method: "DELETE",
      headers: { Authorization: token },
    });
    if (res.ok) setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  const pendingUsers  = users.filter((u) => !u.approved);
  const approvedUsers = users.filter((u) => u.approved && (roleFilter === "ALL" || u.role === roleFilter));

  if (loading) return (
    <div className="p-6 flex items-center gap-2 text-sm text-gray-400">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-500" />
      Loading users…
    </div>
  );

  if (error) return (
    <div className="p-6 text-sm text-red-500">{error}</div>
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">User Management</h1>
        <p className="mt-1 text-sm text-gray-500">Approve requests and manage system users.</p>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-1 border-b border-gray-200">
        {(["REQUESTS", "USERS"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium transition border-b-2 -mb-px ${
              activeTab === tab
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab === "REQUESTS" ? "Approval Requests" : "Current Users"}
            {tab === "REQUESTS" && pendingUsers.length > 0 && (
              <span className="ml-2 rounded-full bg-red-100 px-1.5 py-0.5 text-xs font-semibold text-red-600">
                {pendingUsers.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Requests Tab ── */}
      {activeTab === "REQUESTS" && (
        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-400 border-b border-gray-100">
              <tr>
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3">Role</th>
                <th className="px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {pendingUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-8 text-center text-gray-400">
                    No pending approval requests.
                  </td>
                </tr>
              ) : (
                pendingUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition">
                    <td className="px-5 py-3 font-medium text-gray-900">{user.name}</td>
                    <td className="px-5 py-3 text-gray-500">{user.email}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${roleBadge[user.role] ?? "bg-gray-50 text-gray-500 border-gray-200"}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-5 py-3 flex gap-2">
                      <button
                        onClick={() => handleApprove(user.id)}
                        className="rounded-md border border-green-200 bg-green-50 px-3 py-1 text-xs font-medium text-green-600 hover:bg-green-100 transition"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(user.id)}
                        className="rounded-md border border-red-200 bg-red-50 px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-100 transition"
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Users Tab ── */}
      {activeTab === "USERS" && (
        <>
          <div className="mb-4">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as "ALL" | UserRole)}
              className={inputCls}
            >
              <option value="ALL">All Roles</option>
              <option value="MANAGER">Manager</option>
              <option value="DISPATCHER">Dispatcher</option>
              <option value="SAFETY">Safety</option>
              <option value="FINANCE">Finance</option>
            </select>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-400 border-b border-gray-100">
                <tr>
                  <th className="px-5 py-3">Name</th>
                  <th className="px-5 py-3">Email</th>
                  <th className="px-5 py-3">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {approvedUsers.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-5 py-8 text-center text-gray-400">
                      No users found.
                    </td>
                  </tr>
                ) : (
                  approvedUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition">
                      <td className="px-5 py-3 font-medium text-gray-900">{user.name}</td>
                      <td className="px-5 py-3 text-gray-500">{user.email}</td>
                      <td className="px-5 py-3">
                        <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${roleBadge[user.role] ?? "bg-gray-50 text-gray-500 border-gray-200"}`}>
                          {user.role}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default Users;