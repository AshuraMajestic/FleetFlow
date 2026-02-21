import { Outlet } from "react-router-dom";
import AdminSidebar from "./components/AdminSidebar";

export const AdminLayout = () => (
  <div className="flex h-screen bg-gray-50">
    <AdminSidebar />
    <main className="flex-1 overflow-y-auto">
      <Outlet />
    </main>
  </div>
);

export default AdminLayout;