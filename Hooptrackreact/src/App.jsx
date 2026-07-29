import {BrowserRouter,Routes,Route,Navigate, } from "react-router-dom";

import Login from "./components/Login";
import ScoutSignup from "./pages/scout/ScoutSignup";
import SuperAdminDashboard from "./pages/superadmin/SuperAdminDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import CoachDashboard from "./pages/coach/CoachDashboard";
import GuardianDashboard from "./pages/guardian/GuardianDashboard";
import ScoutDashboard from "./pages/scout/ScoutDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider, useAuth } from "./context/AuthContext";

const ROLE_HOME = {
  SUPERADMIN: "/superadmin",
  ADMIN: "/admin",
  COACH: "/coach",
  GUARDIAN: "/guardian",
  SCOUT: "/scout",
};

function RootRedirect() {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Navigate to={ROLE_HOME[user?.role] || "/login"} replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/scout-signup" element={<ScoutSignup/>} />

          <Route
            path="/superadmin"
            element={
              <ProtectedRoute roles={["SUPERADMIN"]}>
                <SuperAdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={["ADMIN"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/coach"
            element={
              <ProtectedRoute roles={["COACH"]}>
                <CoachDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/guardian"
            element={
              <ProtectedRoute roles={["GUARDIAN"]}>
                <GuardianDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/scout"
            element={
              <ProtectedRoute roles={["SCOUT"]}>
                <ScoutDashboard />
              </ProtectedRoute>
            }
          />

          <Route path="/" element={<RootRedirect />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
