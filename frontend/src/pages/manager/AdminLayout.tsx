import { Outlet } from "react-router-dom";
import AdminSidebar from "./components/AdminSidebar";


const AdminLayout = () => {
  return (
    <div className="flex h-screen">
      <AdminSidebar />

      <div className="flex-1 bg-black p-6 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;