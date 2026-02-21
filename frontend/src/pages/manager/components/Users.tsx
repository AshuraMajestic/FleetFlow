import { useState } from "react";
import type { User } from "../../../types/authTypes";
import type { UserRole } from "../../auth/Register";

const Users = () => {
  const [activeTab, setActiveTab] = useState<"REQUESTS" | "USERS">("REQUESTS");

  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      name: "Admin",
      email: "admin@fleet.com",
      role: "MANAGER",
      phone: "9999999999",
      address: "HQ",
      password: "hashed",
      approved: true,
    },
    {
      id: "2",
      name: "Rahul",
      email: "finance@fleet.com",
      role: "FINANCE",
      phone: "8888888888",
      address: "Mumbai",
      password: "hashed",
      approved: false, // waiting approval
    },
  ]);

  const [roleFilter, setRoleFilter] = useState<"ALL" | UserRole>("ALL");

  // 🔹 Pending Requests
  const pendingUsers = users.filter((user) => !user.approved);

  // 🔹 Approved Users with Filter
  const approvedUsers = users.filter(
    (user) =>
      user.approved &&
      (roleFilter === "ALL" || user.role === roleFilter)
  );

  // 🔹 Approve
  const handleApprove = (id: string) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === id ? { ...user, approved: true } : user
      )
    );
  };

  // 🔹 Reject (Delete)
  const handleReject = (id: string) => {
    setUsers((prev) => prev.filter((user) => user.id !== id));
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">User Management</h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab("REQUESTS")}
          className={`px-4 py-2 rounded-lg ${
            activeTab === "REQUESTS"
              ? "bg-blue-600 text-white"
              : "bg-gray-200"
          }`}
        >
          Approval Requests
        </button>

        <button
          onClick={() => setActiveTab("USERS")}
          className={`px-4 py-2 rounded-lg ${
            activeTab === "USERS"
              ? "bg-blue-600 text-white"
              : "bg-gray-200"
          }`}
        >
          Current Users
        </button>
      </div>

      {/* ========================= */}
      {/* 🔵 TAB 1 - APPROVAL REQUESTS */}
      {/* ========================= */}
      {activeTab === "REQUESTS" && (
        <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingUsers.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-6 text-center text-gray-500">
                    No pending approval requests
                  </td>
                </tr>
              )}

              {pendingUsers.map((user) => (
                <tr key={user.id} className="border-b">
                  <td className="px-6 py-4">{user.name}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">{user.role}</td>
                  <td className="px-6 py-4 flex gap-2">
                    <button
                      onClick={() => handleApprove(user.id)}
                      className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(user.id)}
                      className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ========================= */}
      {/* 🟢 TAB 2 - CURRENT USERS */}
      {/* ========================= */}
      {activeTab === "USERS" && (
        <>
          {/* Role Filter */}
          <div className="mb-4">
            <select
              className="border px-4 py-2 rounded-lg"
              value={roleFilter}
              onChange={(e) =>
                setRoleFilter(e.target.value as "ALL" | UserRole)
              }
            >
              <option value="ALL">All Roles</option>
              <option value="MANAGER">Manager</option>
              <option value="DISPATCHER">Dispatcher</option>
              <option value="SAFETY">Safety</option>
              <option value="FINANCE">Finance</option>
            </select>
          </div>

          <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Role</th>
                </tr>
              </thead>

              <tbody>
                {approvedUsers.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-6 py-6 text-center text-gray-500">
                      No approved users
                    </td>
                  </tr>
                )}

                {approvedUsers.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4">{user.name}</td>
                    <td className="px-6 py-4">{user.email}</td>
                    <td className="px-6 py-4">{user.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default Users;