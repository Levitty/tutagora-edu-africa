
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { TutorDashboard } from "@/components/dashboard/TutorDashboard";

const TutorDashboardPage = () => {
  return (
    <ProtectedRoute requiredRole="tutor">
      <TutorDashboard />
    </ProtectedRoute>
  );
};

export default TutorDashboardPage;
