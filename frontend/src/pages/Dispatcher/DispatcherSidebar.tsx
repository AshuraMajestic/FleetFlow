import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const menuItems = [
  { name: "Dashboard", path: "/" },
  { name: "Cargo",     path: "/cargo" },
  { name: "Trip",      path: "/trip" },
];

export const DispatcherSidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <aside className="flex h-screen w-56 flex-col border-r border-gray-200 bg-white">

      {/* Logo */}
      <div className="border-b border-gray-100 px-5 py-5">
        <span className="text-base font-bold text-gray-900">FleetFlow</span>
      </div>

      {/* Nav */}
      <nav className="flex flex-1 flex-col gap-0.5 p-3">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `rounded-lg px-3 py-2 text-sm font-medium transition ${
                isActive
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`
            }
          >
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="border-t border-gray-100 p-3">
        <button
          onClick={() => { logout(); navigate("/login"); }}
          className="w-full rounded-lg px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50 transition text-left"
        >
          Log out
        </button>
      </div>
    </aside>
  );
};

export default DispatcherSidebar;