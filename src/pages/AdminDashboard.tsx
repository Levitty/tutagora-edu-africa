
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

const AdminDashboardPage = () => {
  return (
    <ProtectedRoute requiredRole="super_admin">
      <AdminDashboard />
    </ProtectedRoute>
  );
};

export default AdminDashboardPage;
