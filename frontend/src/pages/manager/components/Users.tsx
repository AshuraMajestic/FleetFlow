import { useState } from "react";

interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: string;
  isRegistered: boolean;
}

const Users = () => {
  const [users, setUsers] = useState<SystemUser[]>([
    {
      id: "1",
      name: "Admin",
      email: "admin@fleet.com",
      role: "MANAGER",
      isRegistered: true,
    },
    {
      id: "2",
      name: "",
      email: "finance@fleet.com",
      role: "FINANCE",
      isRegistered: false,
    },
  ]);

  const [roleFilter, setRoleFilter] = useState("ALL");
  const [registrationFilter, setRegistrationFilter] = useState("ALL");

  const [showModal, setShowModal] = useState(false);

  const [newUser, setNewUser] = useState({
    email: "",
    role: "DISPATCHER",
  });

  const filteredUsers = users.filter((user) => {
    const roleMatch =
      roleFilter === "ALL" || user.role === roleFilter;

    const registrationMatch =
      registrationFilter === "ALL" ||
      (registrationFilter === "REGISTERED" && user.isRegistered) ||
      (registrationFilter === "NOT_REGISTERED" && !user.isRegistered);

    return roleMatch && registrationMatch;
  });

  const getRegistrationBadge = (isRegistered: boolean) => {
    return isRegistered
      ? "bg-blue-100 text-blue-600"
      : "bg-yellow-100 text-yellow-700";
  };

  const handleAddUser = () => {
    if (!newUser.email) return;

    const user: SystemUser = {
      id: Date.now().toString(),
      name: "",
      email: newUser.email,
      role: newUser.role,
      isRegistered: false,
    };

    setUsers([...users, user]);
    setShowModal(false);
    setNewUser({ email: "", role: "DISPATCHER" });
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>

        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + Add User
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <select
          className="border px-4 py-2 rounded-lg"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="ALL">All Roles</option>
          <option value="MANAGER">Manager</option>
          <option value="DISPATCHER">Dispatcher</option>
          <option value="SAFETY">Safety</option>
          <option value="FINANCE">Finance</option>
        </select>

        <select
          className="border px-4 py-2 rounded-lg"
          value={registrationFilter}
          onChange={(e) => setRegistrationFilter(e.target.value)}
        >
          <option value="ALL">All Registration</option>
          <option value="REGISTERED">Registered</option>
          <option value="NOT_REGISTERED">Not Registered</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Registration</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map((user) => (
              <tr
                key={user.id}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="px-6 py-4 font-medium">
                  {user.name || "—"}
                </td>

                <td className="px-6 py-4">
                  {user.email}
                </td>

                <td className="px-6 py-4">
                  {user.role}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 text-sm font-semibold rounded-full ${getRegistrationBadge(
                      user.isRegistered
                    )}`}
                  >
                    {user.isRegistered
                      ? "Registered"
                      : "Not Registered"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl p-6 w-96 shadow-xl">
            <h2 className="text-xl font-bold mb-4">Invite New User</h2>

            <input
              type="email"
              placeholder="User Email"
              value={newUser.email}
              onChange={(e) =>
                setNewUser({ ...newUser, email: e.target.value })
              }
              className="w-full border px-4 py-2 rounded-lg mb-4"
            />

            <select
              value={newUser.role}
              onChange={(e) =>
                setNewUser({ ...newUser, role: e.target.value })
              }
              className="w-full border px-4 py-2 rounded-lg mb-4"
            >
              <option value="DISPATCHER">Dispatcher</option>
              <option value="SAFETY">Safety</option>
              <option value="FINANCE">Finance</option>
              <option value="MANAGER">Manager</option>
            </select>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg border"
              >
                Cancel
              </button>

              <button
                onClick={handleAddUser}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                Invite
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;