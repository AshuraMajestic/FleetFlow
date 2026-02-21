import { Outlet } from "react-router-dom";
import DispatcherSidebar from "./DispatcherSidebar";


const DispatcherLayout = () => {
  return (
    <div className="flex h-screen">
      <DispatcherSidebar />

      <div className="flex-1 bg-black p-6 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default DispatcherLayout;