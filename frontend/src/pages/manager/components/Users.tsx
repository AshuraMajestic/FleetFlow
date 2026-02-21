import { useEffect, useState } from "react";

type UserRole =
  | "MANAGER"
  | "DISPATCHER"
  | "SAFETY"
  | "FINANCE";

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  address?: string;
  approved: boolean;
}

const Users = () => {
  const [activeTab, setActiveTab] = useState<"REQUESTS" | "USERS">(
    "REQUESTS"
  );

  const [users, setUsers] = useState<User[]>([]);
  const [roleFilter, setRoleFilter] =
    useState<"ALL" | UserRole>("ALL");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ===============================
     FETCH USERS
  =============================== */
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("fleet_token");

        const res = await fetch(
          "http://localhost:5000/api/admin/users",
          {
            headers: {
              Authorization: token || "",
            },
          }
        );

        if (!res.ok)
          throw new Error("Failed to fetch users");

        const data = await res.json();

        const formatted = data.map((u: any) => ({
          id: u._id,
          name: u.name,
          email: u.email,
          role: u.role,
          phone: u.phone,
          address: u.address,
          approved: u.approved,
        }));

        setUsers(formatted);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  /* ===============================
     FILTER LOGIC
  =============================== */

  const pendingUsers = users.filter(
    (user) => !user.approved
  );

  const approvedUsers = users.filter(
    (user) =>
      user.approved &&
      (roleFilter === "ALL" ||
        user.role === roleFilter)
  );

  /* ===============================
     APPROVE USER
  =============================== */

  const handleApprove = async (id: string) => {
    try {
      const token = localStorage.getItem("fleet_token");

      const res = await fetch(
        `http://localhost:5000/api/admin/users/approve/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: token || "",
          },
        }
      );

      if (!res.ok)
        throw new Error("Approval failed");

      setUsers((prev) =>
        prev.map((user) =>
          user.id === id
            ? { ...user, approved: true }
            : user
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  /* ===============================
     REJECT USER
  =============================== */

  const handleReject = async (id: string) => {
    try {
      const token = localStorage.getItem("fleet_token");

      const res = await fetch(
        `http://localhost:5000/api/admin/users/reject/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: token || "",
          },
        }
      );

      if (!res.ok)
        throw new Error("Reject failed");

      setUsers((prev) =>
        prev.filter((user) => user.id !== id)
      );
    } catch (err) {
      console.error(err);
    }
  };

  /* ===============================
     LOADING / ERROR
  =============================== */

  if (loading) {
    return (
      <div className="p-6">
        <p>Loading users...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        User Management
      </h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() =>
            setActiveTab("REQUESTS")
          }
          className={`px-4 py-2 rounded-lg ${
            activeTab === "REQUESTS"
              ? "bg-blue-600 text-white"
              : "bg-gray-200"
          }`}
        >
          Approval Requests
        </button>

        <button
          onClick={() =>
            setActiveTab("USERS")
          }
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
      {/* REQUEST TAB */}
      {/* ========================= */}
      {activeTab === "REQUESTS" && (
        <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-4">
                  Name
                </th>
                <th className="px-6 py-4">
                  Email
                </th>
                <th className="px-6 py-4">
                  Role
                </th>
                <th className="px-6 py-4">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {pendingUsers.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-6 text-center text-gray-500"
                  >
                    No pending approval requests
                  </td>
                </tr>
              )}

              {pendingUsers.map((user) => (
                <tr
                  key={user.id}
                  className="border-b"
                >
                  <td className="px-6 py-4">
                    {user.name}
                  </td>
                  <td className="px-6 py-4">
                    {user.email}
                  </td>
                  <td className="px-6 py-4">
                    {user.role}
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <button
                      onClick={() =>
                        handleApprove(user.id)
                      }
                      className="px-3 py-1 bg-green-600 text-white rounded-lg"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() =>
                        handleReject(user.id)
                      }
                      className="px-3 py-1 bg-red-600 text-white rounded-lg"
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
      {/* USERS TAB */}
      {/* ========================= */}
      {activeTab === "USERS" && (
        <>
          <div className="mb-4">
            <select
              className="border px-4 py-2 rounded-lg"
              value={roleFilter}
              onChange={(e) =>
                setRoleFilter(
                  e.target.value as
                    | "ALL"
                    | UserRole
                )
              }
            >
              <option value="ALL">
                All Roles
              </option>
              <option value="MANAGER">
                Manager
              </option>
              <option value="DISPATCHER">
                Dispatcher
              </option>
              <option value="SAFETY">
                Safety
              </option>
              <option value="FINANCE">
                Finance
              </option>
            </select>
          </div>

          <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-4">
                    Name
                  </th>
                  <th className="px-6 py-4">
                    Email
                  </th>
                  <th className="px-6 py-4">
                    Role
                  </th>
                </tr>
              </thead>

              <tbody>
                {approvedUsers.length === 0 && (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-6 py-6 text-center text-gray-500"
                    >
                      No approved users
                    </td>
                  </tr>
                )}

                {approvedUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      {user.name}
                    </td>
                    <td className="px-6 py-4">
                      {user.email}
                    </td>
                    <td className="px-6 py-4">
                      {user.role}
                    </td>
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