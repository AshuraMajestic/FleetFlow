import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";

import Login from "./pages/auth/Login";
import RegisterUser from "./pages/auth/Register";
import AdminLayout from "./pages/manager/AdminLayout";
import Dashboard from "./pages/manager/Dashboard";
import Vehicles from "./pages/manager/components/Vehicles";
import Drivers from "./pages/manager/components/Drivers";
import Users from "./pages/manager/components/Users";
import Maintenance from "./pages/manager/components/Maintenance";
import DispatcherDashboard from "./pages/Dispatcher/DispatcherDashboard";
import SafetyDashboard from "./pages/Safety/SafetyDashboard";
import SafetyLayout from "./pages/Safety/SafetyLayout";
import SafetyVehicles from "./pages/Safety/SafetyVehicles";
import SafetyDrivers from "./pages/Safety/SafetyDrivers";
import DispatcherLayout from "./pages/Dispatcher/DispatcherLayout";
import DispatcherCargo from "./pages/Dispatcher/DispatcherCargo";
import DispatcherTrip from "./pages/Dispatcher/DispatcherTrip";
import FinanceDashboard from "./pages/Finance/FinanceDashboard";

function App() {
  const { user, isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      {!isAuthenticated && (
        <>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterUser />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </>
      )}

      {/* Private Routes */}
      {isAuthenticated && user?.role === "MANAGER" && (
        <Route path="/" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="vehicles" element={<Vehicles />} />
          <Route path="drivers" element={<Drivers />} />
          <Route path="maintenance" element={<Maintenance />} />
          <Route path="users" element={<Users />} />
        </Route>
      )}
      {isAuthenticated && user?.role === "DISPATCHER" && (
        <Route path="/" element={<DispatcherLayout />}>
          <Route index element={<DispatcherDashboard />} />

          <Route path="cargo" element={<DispatcherCargo />} />
          <Route path="trip" element={<DispatcherTrip />} />
        </Route>
      )}


      {isAuthenticated && user?.role === "SAFETY" && (
        <Route path="/" element={<SafetyLayout />}>
          <Route index element={<SafetyDashboard />} />
          <Route path="vehicles" element={<SafetyVehicles />} />
          <Route path="drivers" element={<SafetyDrivers />} />
        </Route>
      )}
      {isAuthenticated && user?.role === "FINANCE" && (
        <Route path="/" element={<FinanceDashboard />} />
      )}
      {/* Fallback */}
      {isAuthenticated && <Route path="*" element={<Navigate to="/" />} />}
    </Routes>
  );
}

export default App;