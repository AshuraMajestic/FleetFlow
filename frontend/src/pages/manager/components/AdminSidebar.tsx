import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";

const AdminSidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { name: "Dashboard", path: "/" },
    { name: "Vehicles", path: "/vehicles" },
    { name: "Drivers", path: "/drivers" },
    { name: "Trips", path: "/trips" },
    { name: "Maintenance", path: "/maintenance" },
    { name: "Users", path: "/users" },
  ];

  return (
    <div className="flex h-screen w-64 flex-col bg-gray-900 text-white shadow-lg">
      
      {/* Logo */}
      <div className="flex items-center justify-center border-b border-gray-700 py-6 text-xl font-bold">
        FleetFlow
      </div>

      {/* Menu */}
      <nav className="flex flex-1 flex-col gap-2 p-4">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `rounded-lg px-4 py-2 transition ${
                isActive
                  ? "bg-blue-600"
                  : "hover:bg-gray-800"
              }`
            }
          >
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="border-t border-gray-700 p-4">
        <button
          onClick={() => {
            logout();
            navigate("/login");
          }}
          className="w-full rounded-lg bg-red-600 py-2 font-semibold hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;