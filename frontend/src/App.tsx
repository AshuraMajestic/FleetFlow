import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import Login from "./pages/auth/Login";
import ManagerDashboard from "./pages/manager/ManagerDashboard";
import DispatcherDashboard from "./pages/Dispatcher/DispatcherDashboard";
import SafetyDashboard from "./pages/Safety/SafetyDashboard";
import FinanceDashboard from "./pages/Finance/FinanceDashboard";


function App() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="*" element={<Login />} />
      </Routes>
    );
  }

  const getDashboardByRole = () => {
    switch (user?.role) {
      case "MANAGER":
        return <ManagerDashboard />;
      case "DISPATCHER":
        return <DispatcherDashboard />;
      case "SAFETY":
        return <SafetyDashboard />;
      case "FINANCE":
        return <FinanceDashboard />;
      default:
        return <Login />;
    }
  };

  return (
    <Routes>
      <Route path="/" element={getDashboardByRole()} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;