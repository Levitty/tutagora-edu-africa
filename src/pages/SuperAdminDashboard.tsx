
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { SuperAdminDashboard } from "@/components/dashboard/SuperAdminDashboard";

const SuperAdminDashboardPage = () => {
  return (
    <ProtectedRoute requiredRole="super_admin">
      <SuperAdminDashboard />
    </ProtectedRoute>
  );
};

export default SuperAdminDashboardPage;
