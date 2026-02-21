import { Outlet } from "react-router-dom";
import SafetySidebar from "./SafetySidebar";


const SafetyLayout = () => {
  return (
    <div className="flex h-screen">
      <SafetySidebar />

      <div className="flex-1 bg-black p-6 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default SafetyLayout;