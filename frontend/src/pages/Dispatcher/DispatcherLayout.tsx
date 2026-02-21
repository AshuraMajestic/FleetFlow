import { Outlet } from "react-router-dom";
import DispatcherSidebar from "./DispatcherSidebar";

export const DispatcherLayout = () => (
  <div className="flex h-screen bg-gray-50">
    <DispatcherSidebar />
    <main className="flex-1 overflow-y-auto">
      <Outlet />
    </main>
  </div>
);

export default DispatcherLayout;