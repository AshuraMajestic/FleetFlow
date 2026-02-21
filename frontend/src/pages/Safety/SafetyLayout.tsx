
// ─── SafetyLayout.tsx ─────────────────────────────────────────────────────────
import { Outlet } from "react-router-dom";
import SafetySidebar from "./SafetySidebar";

export const SafetyLayout = () => (
  <div className="flex h-screen bg-gray-50">
    <SafetySidebar />
    <main className="flex-1 overflow-y-auto">
      <Outlet />
    </main>
  </div>
);

export default SafetyLayout;